import type { Express } from 'express';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ReportService } from '../reports/report.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { CatalogosService } from '../catalogos/catalogos.service';
import { Servicio, ServicioDocument } from './schemas/servicio.schema';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { ConfirmarCodigoDto } from './dto/confirmar-codigo.dto';
import { ValidarCodigoDto } from './dto/validar-codigo.dto';
import { Usuario, UsuarioDocument } from '../users/schemas/usuario.schema';
import { ConfigurarOperacionDto } from './dto/configurar-operacion.dto';
import { MarcarDto } from './dto/marcar.dto';
import { DatosPuntoDto } from './dto/datos-punto.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectModel(Servicio.name) private readonly servicioModel: Model<ServicioDocument>,
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
    private readonly catalogos: CatalogosService,
    private readonly reportService: ReportService,

  ) {}

  private contRegex = /^[A-Z]{3,4}[0-9]{6,7}$/;

  /** Valida combinación, unidad y contenedores (simple vs múltiple) contra catálogo.
   *  Devuelve la unidad final (derivada si no viene), y normaliza la sección `carga`.
   */
  private validarCatalogoYContenedores(params: {
    semiTipoId: string;
    cargaTipoId: string;
    cargaUnidad?: 'UNIDAD'|'LITROS'|'TONELADAS';
    cantidad?: number;
    numeroContenedor?: string;
    numeroRotainer?: string;
    contenedores?: { numeroContenedor: string; numeroRotainer?: string }[];
  }) {
    const { semiTipoId, cargaTipoId } = params;

    // 1) Validar combinación semi↔carga
    const cargaOk = this.catalogos.validateSemiCarga(semiTipoId, cargaTipoId);
    if (!cargaOk) {
      throw new BadRequestException('La combinación Semirremolque/Carga no es válida para el catálogo.');
    }

    // 2) Capacidades derivadas (unidad, reqs, max)
    const caps = this.catalogos.getCapabilities(semiTipoId, cargaTipoId);
    if (!caps) throw new BadRequestException('No se pudieron derivar capacidades de catálogo.');

    // 3) Unidad: si viene en DTO, debe coincidir; si no, la derivamos
    const unidad = params.cargaUnidad ?? caps.unidad;
    if (params.cargaUnidad && params.cargaUnidad !== caps.unidad) {
      throw new BadRequestException('La unidad enviada no corresponde al tipo de carga.');
    }

    // 4) Cantidad: solo aplica para LITROS/TONELADAS
    if (unidad === 'UNIDAD') {
      if (params.cantidad !== undefined) {
        throw new BadRequestException('La cantidad solo aplica para cargas en LITROS o TONELADAS.');
      }
    } else {
      if (params.cantidad === undefined || params.cantidad <= 0) {
        throw new BadRequestException('Debe informar cantidad válida para esta unidad.');
      }
    }

    // 5) Contenedores (simple/múltiple) según capacidades
    const reqCont = caps.reqContenedor;
    const reqRot = caps.reqRotainer;
    const max = caps.maxContenedores ?? 1;

    const hasArray = !!params.contenedores && params.contenedores.length > 0;
    const hasSimple = !!params.numeroContenedor;

    if (!reqCont) {
      if (hasArray || hasSimple || params.numeroRotainer) {
        throw new BadRequestException('Esta carga no requiere contenedor/rotainer.');
      }
      return {
        unidad,
        carga: {
          tipoId: cargaTipoId,
          unidad,
          cantidad: params.cantidad,
        } as any,
        caps,
      };
    }

    if (hasArray && hasSimple) {
      throw new BadRequestException('Use contenedor simple o múltiple, no ambos.');
    }

    if (max > 1 && hasArray) {
      if (params.contenedores!.length !== 2) {
        throw new BadRequestException('Se requieren exactamente 2 contenedores.');
      }
      const norm = params.contenedores!.map((c, i) => {
        if (!c.numeroContenedor || !this.contRegex.test(c.numeroContenedor)) {
          throw new BadRequestException(`Número de contenedor #${i + 1} inválido.`);
        }
        if (reqRot && !c.numeroRotainer) {
          throw new BadRequestException(`Se requiere N° de rotainer para el contenedor #${i + 1}.`);
        }
        return { numeroContenedor: c.numeroContenedor, numeroRotainer: c.numeroRotainer };
      });

      return {
        unidad,
        carga: {
          tipoId: cargaTipoId,
          unidad,
          cantidad: params.cantidad,
          contenedores: norm,
        } as any,
        caps,
      };
    }

    if (!hasSimple) {
      throw new BadRequestException('Debe informar N° de contenedor.');
    }
    if (!this.contRegex.test(params.numeroContenedor!)) {
      throw new BadRequestException('Formato de contenedor inválido.');
    }
    if (reqRot && !params.numeroRotainer) {
      throw new BadRequestException('Se requiere N° de rotainer para este tipo de carga.');
    }

    return {
      unidad,
      carga: {
        tipoId: cargaTipoId,
        unidad,
        cantidad: params.cantidad,
        numeroContenedor: params.numeroContenedor,
        numeroRotainer: params.numeroRotainer,
      } as any,
      caps,
    };
  }

  /** ADMIN crea servicio (asignado o preparado con código) */
  async create(dto: CreateServicioDto) {
    const { unidad, carga } = this.validarCatalogoYContenedores({
      semiTipoId: dto.semiTipoId,
      cargaTipoId: dto.cargaTipoId,
      cargaUnidad: dto.cargaUnidad,
      cantidad: dto.cantidad,
      numeroContenedor: dto.numeroContenedor,
      numeroRotainer: dto.numeroRotainer,
      contenedores: dto.contenedores,
    });

    const puntosBase: Array<{ tipo: 'CARGA'|'INTERMEDIO'|'DESCARGA'; lugar: string }> =
  dto.tipoServicio === 'ONE_WAY'
    ? [
        { tipo: 'CARGA', lugar: '' },
        { tipo: 'DESCARGA', lugar: '' },
      ]
    : [
        { tipo: 'CARGA', lugar: '' },
        { tipo: 'INTERMEDIO', lugar: '' },
        { tipo: 'DESCARGA', lugar: '' },
      ];

    const toSave: Partial<Servicio> = {
      empresaId: dto.empresaId as any,
      adminId: dto.adminId as any,
      conductorId: dto.conductorId as any,
      tipoServicio: dto.tipoServicio,
      equipo: {
        tractoPatente: dto.tractoPatente,
        semiPatente: dto.semiPatente,
        semiTipoId: dto.semiTipoId,
      },
      carga: {
        ...carga,
        peligrosa: dto.peligrosa,
        clasePeligrosa: dto.clasePeligrosa,
        nUN: dto.nUN,
      },
      operacion: puntosBase.map(p => ({
        ...p,
        marcas: {},
        fotosGuia: [],
        fotosCarga: [],
      })),
      fecha: dto.fecha ? new Date(dto.fecha) : new Date(),
      codigo: dto.codigo,
      requiereAprobacionAlReclamar: dto.requiereAprobacionAlReclamar ?? true,
      estadoOperativo: 'ASIGNADO',
    };

    return this.servicioModel.create(toSave);
  }

  /** ADMIN genera código para un servicio existente */
  async generarCodigo(servicioId: string, adminUserId: string) {
    const serv = await this.servicioModel.findById(servicioId);
    if (!serv) throw new NotFoundException('Servicio no encontrado');

    const admin = await this.usuarioModel.findById(adminUserId);
    if (!admin || String(admin.empresaId) !== String(serv.empresaId)) {
      throw new ForbiddenException('No autorizado');
    }

    if (serv.codigo) return { codigo: serv.codigo };

    const codigo = await this.nuevoCodigoUnico();
    serv.codigo = codigo;
    await serv.save();
    return { codigo };
  }

  private async nuevoCodigoUnico(): Promise<string> {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const gen = () => Array.from({ length: 8 }).map(() => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    for (let i = 0; i < 10; i++) {
      const code = gen();
      const exists = await this.servicioModel.exists({ codigo: code });
      if (!exists) return code;
    }
    throw new BadRequestException('No fue posible generar un código único');
  }

  /** CONDUCTOR: validar código (prefill + capacidades) */
  async validarCodigo(dto: ValidarCodigoDto, conductorUserId: string) {
    const serv = await this.servicioModel.findOne({ codigo: dto.codigo });
    if (!serv) throw new NotFoundException('Código no encontrado');
    if (serv.reclamo?.usado) throw new BadRequestException('Este código ya fue utilizado');

    const conductor = await this.usuarioModel.findById(conductorUserId);
    if (!conductor) throw new ForbiddenException('Conductor inválido');
    if (!conductor.empresaId || String(conductor.empresaId) !== String(serv.empresaId)) {
      throw new ForbiddenException('Código no disponible para tu empresa');
    }

    const semiTipoId = serv.equipo?.semiTipoId ?? '';
    const cargaTipoId = serv.carga?.tipoId ?? '';
    const caps = this.catalogos.getCapabilities(semiTipoId, cargaTipoId);

    const prefill = {
      tipoServicio: serv.tipoServicio,
      equipo: {
        semiTipoId: serv.equipo?.semiTipoId,
        tractoPatente: serv.equipo?.tractoPatente,
        semiPatente: serv.equipo?.semiPatente,
      },
      carga: {
        tipoId: serv.carga?.tipoId,
        unidad: serv.carga?.unidad,
        cantidad: serv.carga?.cantidad,
        numeroContenedor: serv.carga?.numeroContenedor,
        numeroRotainer: serv.carga?.numeroRotainer,
        contenedores: serv.carga?.contenedores,
      },
    };

    const pasosBloqueados: string[] = [];
    if (serv.tipoServicio) pasosBloqueados.push('tipoServicio');
    if (serv.equipo?.semiTipoId) pasosBloqueados.push('equipo.semiTipoId');
    if (serv.equipo?.tractoPatente) pasosBloqueados.push('equipo.tractoPatente');
    if (serv.equipo?.semiPatente) pasosBloqueados.push('equipo.semiPatente');
    if (serv.carga?.tipoId) pasosBloqueados.push('carga.tipoId');
    if (serv.carga?.unidad) pasosBloqueados.push('carga.unidad');
    if (serv.carga?.numeroContenedor) pasosBloqueados.push('carga.numeroContenedor');
    if (serv.carga?.numeroRotainer) pasosBloqueados.push('carga.numeroRotainer');
    if (serv.carga?.contenedores?.length) pasosBloqueados.push('carga.contenedores');

    return {
      servicioId: String(serv._id),
      empresaId: String(serv.empresaId),
      prefill,
      pasosBloqueados,
      capacidades: {
        permiteMultipleContenedores: !!caps && (caps.maxContenedores ?? 1) > 1,
        maxContenedores: caps?.maxContenedores ?? 1,
        reqContenedor: caps?.reqContenedor ?? false,
        reqRotainer: caps?.reqRotainer ?? false,
      },
    };
  }

  /** CONDUCTOR: confirmar código (completa faltantes y reclama) */
  async confirmarCodigo(dto: ConfirmarCodigoDto, conductorUserId: string) {
    const serv = await this.servicioModel.findOne({ codigo: dto.codigo });
    if (!serv) throw new NotFoundException('Código no encontrado');
    if (serv.reclamo?.usado) throw new BadRequestException('Este código ya fue utilizado');

    const conductor = await this.usuarioModel.findById(conductorUserId);
    if (!conductor) throw new ForbiddenException('Conductor inválido');
    if (!conductor.empresaId || String(conductor.empresaId) !== String(serv.empresaId)) {
      throw new ForbiddenException('Código no disponible para tu empresa');
    }

    // No permitir cambios sobre valores fijados por Admin
    const mismatch = (sv: any, inDto: any) => inDto !== undefined && sv !== undefined && sv !== inDto;
    if (mismatch(serv.tipoServicio, dto.tipoServicio)) throw new BadRequestException('tipoServicio bloqueado por Admin');
    if (mismatch(serv.equipo?.semiTipoId, dto.semiTipoId)) throw new BadRequestException('semiTipoId bloqueado por Admin');
    if (mismatch(serv.equipo?.tractoPatente, dto.tractoPatente)) throw new BadRequestException('tractoPatente bloqueado por Admin');
    if (mismatch(serv.equipo?.semiPatente, dto.semiPatente)) throw new BadRequestException('semiPatente bloqueado por Admin');
    if (mismatch(serv.carga?.tipoId, dto.cargaTipoId)) throw new BadRequestException('carga.tipoId bloqueado por Admin');

    const semiTipoId = serv.equipo?.semiTipoId ?? dto.semiTipoId!;
    const cargaTipoId = serv.carga?.tipoId ?? dto.cargaTipoId!;
    const resultado = this.validarCatalogoYContenedores({
      semiTipoId,
      cargaTipoId,
      cargaUnidad: serv.carga?.unidad ?? dto.cargaUnidad,
      cantidad: serv.carga?.cantidad ?? dto.cantidad,
      numeroContenedor: serv.carga?.numeroContenedor ?? dto.numeroContenedor,
      numeroRotainer: serv.carga?.numeroRotainer ?? dto.numeroRotainer,
      contenedores: serv.carga?.contenedores ?? dto.contenedores,
    });

    const conductorId = conductor._id as unknown as Types.ObjectId;

    serv.conductorId = conductorId;
    serv.tipoServicio = serv.tipoServicio ?? dto.tipoServicio!;
    serv.equipo = {
      tractoPatente: serv.equipo?.tractoPatente ?? dto.tractoPatente,
      semiPatente: serv.equipo?.semiPatente ?? dto.semiPatente,
      semiTipoId,
    };
    serv.carga = {
      ...serv.carga,
      tipoId: cargaTipoId,
      unidad: resultado.unidad,
      cantidad: resultado.carga.cantidad,
      numeroContenedor: resultado.carga.numeroContenedor,
      numeroRotainer: resultado.carga.numeroRotainer,
      contenedores: resultado.carga.contenedores,
      peligrosa: serv.carga?.peligrosa ?? dto.peligrosa,
      clasePeligrosa: serv.carga?.clasePeligrosa ?? dto.clasePeligrosa,
      nUN: serv.carga?.nUN ?? dto.nUN,
    };

    serv.reclamo = { usado: true, usadoPor: conductorId, usadoEn: new Date() };
    serv.estadoOperativo = serv.requiereAprobacionAlReclamar ? 'PENDIENTE_APROBACION' : 'ASIGNADO';

    await serv.save();
    return { ok: true, servicioId: String(serv._id), estadoOperativo: serv.estadoOperativo };
  }

  // ---------------- OPERACIÓN (Conductor) ----------------

  async configurarOperacion(servicioId: string, conductorUserId: string, dto: ConfigurarOperacionDto) {
    const serv = await this.servicioModel.findById(servicioId);
    if (!serv) throw new NotFoundException('Servicio no encontrado');
    if (!serv.conductorId || String(serv.conductorId) !== conductorUserId) {
      throw new ForbiddenException('No autorizado');
    }

    // Validar estructura vs tipoServicio
    const esperado = serv.tipoServicio === 'ONE_WAY' ? ['CARGA','DESCARGA'] : ['CARGA','INTERMEDIO','DESCARGA'];
    const tipos = dto.puntos.map(p => p.tipo);
    if (JSON.stringify(tipos) !== JSON.stringify(esperado)) {
      throw new BadRequestException(`Puntos inválidos para ${serv.tipoServicio}`);
    }

    serv.operacion = dto.puntos.map(p => ({
      ...p,
      marcas: {},
      fotosGuia: [],
      fotosCarga: [],
    }));
    await serv.save();
    return { ok: true, operacion: serv.operacion };
  }

  async marcar(servicioId: string, conductorUserId: string, dto: MarcarDto) {
    const serv = await this.servicioModel.findById(servicioId);
    if (!serv) throw new NotFoundException('Servicio no encontrado');
    if (!serv.conductorId || String(serv.conductorId) !== conductorUserId) {
      throw new ForbiddenException('No autorizado');
    }
    if (!serv.operacion?.[dto.puntoIndex]) throw new BadRequestException('Punto inválido');

    const marcas = serv.operacion[dto.puntoIndex].marcas || {};
    if (marcas[dto.tipoMarca]) {
      throw new BadRequestException(`La marca ${dto.tipoMarca} ya fue registrada`);
    }
    marcas[dto.tipoMarca] = new Date();
    if (dto.lat !== undefined && dto.lng !== undefined) {
      marcas.geo = { lat: dto.lat, lng: dto.lng };
    }
    serv.operacion[dto.puntoIndex].marcas = marcas;
    await serv.save();
    return { ok: true, marcas };
  }

  private ensureDir(p: string) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  }

  async guardarFoto(servicioId: string, conductorUserId: string, puntoIndex: number, tipo: 'guia'|'carga', file: Express.Multer.File) {
    const serv = await this.servicioModel.findById(servicioId);
    if (!serv) throw new NotFoundException('Servicio no encontrado');
    if (!serv.conductorId || String(serv.conductorId) !== conductorUserId) {
      throw new ForbiddenException('No autorizado');
    }
    if (!serv.operacion?.[puntoIndex]) throw new BadRequestException('Punto inválido');

    const base = path.join(process.cwd(), 'uploads', 'photos', String(serv._id), `p${puntoIndex}`, tipo);
    this.ensureDir(base);

    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${Date.now()}${ext}`;
    const full = path.join(base, filename);
    fs.writeFileSync(full, file.buffer);

    const relPath = `/uploads/photos/${serv._id}/p${puntoIndex}/${tipo}/${filename}`;
    if (tipo === 'guia') serv.operacion[puntoIndex].fotosGuia.push(relPath);
    else serv.operacion[puntoIndex].fotosCarga.push(relPath);

    await serv.save();
    return { ok: true, url: relPath };
  }

  async actualizarDatosPunto(servicioId: string, conductorUserId: string, dto: DatosPuntoDto) {
    const serv = await this.servicioModel.findById(servicioId);
    if (!serv) throw new NotFoundException('Servicio no encontrado');
    if (!serv.conductorId || String(serv.conductorId) !== conductorUserId) {
      throw new ForbiddenException('No autorizado');
    }
    if (!serv.operacion?.[dto.puntoIndex]) throw new BadRequestException('Punto inválido');

    const p = serv.operacion[dto.puntoIndex];
    if (dto.numeroGuia !== undefined) p.numeroGuia = dto.numeroGuia;
    if (dto.numeroSello !== undefined) p.numeroSello = dto.numeroSello;
    if (dto.incidenteId !== undefined) p.incidenteId = dto.incidenteId;
    if (dto.incidenteNotas !== undefined) p.incidenteNotas = dto.incidenteNotas;
    if (dto.observaciones !== undefined) p.observaciones = dto.observaciones;

    await serv.save();
    return { ok: true, punto: p };
  }

  async finalizarYGenerarPdf(servicioId: string, conductorUserId: string) {
  const serv = await this.servicioModel.findById(servicioId);
  if (!serv) throw new NotFoundException('Servicio no encontrado');
  if (!serv.conductorId || String(serv.conductorId) !== conductorUserId) {
    throw new ForbiddenException('No autorizado');
  }
  if (!serv.operacion || serv.operacion.length === 0) {
    throw new BadRequestException('Operación no configurada');
  }

  // Validaciones mínimas para finalizar:
  const idxCarga = serv.operacion.findIndex(p => p.tipo === 'CARGA');
  const idxDesc  = serv.operacion.findIndex(p => p.tipo === 'DESCARGA');
  if (idxCarga < 0 || idxDesc < 0) {
    throw new BadRequestException('Faltan puntos de CARGA/DESCARGA');
  }

  const pCarga = serv.operacion[idxCarga];
  const pDesc  = serv.operacion[idxDesc];

  const marcasOk = (p: any) => !!(p?.marcas?.presentacion && p?.marcas?.inicio && p?.marcas?.termino);
  if (!marcasOk(pCarga)) throw new BadRequestException('Faltan marcas de tiempo en punto de CARGA');
  if (!marcasOk(pDesc))  throw new BadRequestException('Faltan marcas de tiempo en punto de DESCARGA');

  // Guía firmada OBLIGATORIA en DESCARGA
  if (!pDesc.fotosGuia || pDesc.fotosGuia.length < 1) {
    throw new BadRequestException('Debe adjuntar al menos una foto de la guía firmada en DESCARGA');
  }

  // Datos mínimos del conductor para el informe
  let conductorLite: { rut?: string; nombre?: string; apellido?: string; fono?: string } | null = null;
  if (serv.conductorId) {
    const c = await this.usuarioModel.findById(serv.conductorId).lean();
    if (c) conductorLite = { rut: c.rut, nombre: c.nombre, apellido: c.apellido, fono: c.fono };
  }

  // Generar PDF pro (Puppeteer)
  const plain = (typeof (serv as any).toObject === 'function') ? (serv as any).toObject() : serv;
  const pdfRel = await this.reportService.generateServicioPdf(plain, conductorLite);

  serv.reportPdfPath = pdfRel;
  serv.estadoOperativo = 'FINALIZADO';
  await serv.save();

  return { ok: true, pdf: pdfRel, estadoOperativo: serv.estadoOperativo };
  }

  private async generarPdf(serv: ServicioDocument): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const PDFDocument = require('pdfkit');
    const reportsDir = path.join(process.cwd(), 'uploads', 'reports');
    this.ensureDir(reportsDir);
    const rel = `/uploads/reports/${serv._id}.pdf`;
    const full = path.join(process.cwd(), rel);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(full);
    doc.pipe(stream);

    doc.fontSize(16).text('Informe de Servicio - NapaviTruck', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Servicio ID: ${serv._id}`);
    doc.text(`Tipo: ${serv.tipoServicio}`);
    doc.text(`Fecha: ${new Date(serv.fecha).toLocaleString()}`);
    doc.moveDown();

    // Equipo
    doc.fontSize(13).text('Equipo', { underline: true });
    doc.fontSize(11).text(`Tracto: ${serv.equipo?.tractoPatente ?? '-'}`);
    doc.text(`Semi: ${serv.equipo?.semiPatente ?? '-'} (tipo: ${serv.equipo?.semiTipoId ?? '-'})`);
    doc.moveDown(0.5);

    // Carga
    doc.fontSize(13).text('Carga', { underline: true });
    doc.fontSize(11).text(`Tipo: ${serv.carga?.tipoId}`);
    doc.text(`Unidad: ${serv.carga?.unidad}`);
    if (serv.carga?.cantidad !== undefined) doc.text(`Cantidad: ${serv.carga.cantidad}`);
    if (serv.carga?.numeroContenedor) doc.text(`N° Contenedor: ${serv.carga.numeroContenedor}`);
    if (serv.carga?.numeroRotainer) doc.text(`N° Rotainer: ${serv.carga.numeroRotainer}`);
    if (serv.carga?.contenedores?.length) {
      serv.carga.contenedores.forEach((c, i) => {
        doc.text(`Contenedor #${i + 1}: ${c.numeroContenedor}${c.numeroRotainer ? ` / Rotainer: ${c.numeroRotainer}` : ''}`);
      });
    }
    if (serv.carga?.peligrosa) {
      doc.text(`Carga peligrosa: Sí (Clase: ${serv.carga.clasePeligrosa ?? '-'}, N° UN: ${serv.carga.nUN ?? '-'})`);
    }
    doc.moveDown();

    // Operación
    doc.fontSize(13).text('Operación', { underline: true });
    serv.operacion?.forEach((p, idx) => {
      doc.fontSize(12).text(`${idx + 1}) ${p.tipo} — ${p.lugar || '(sin lugar)'}`);
      doc.fontSize(10)
        .text(`Presentación: ${p.marcas?.presentacion ? new Date(p.marcas.presentacion).toLocaleString() : '-'}`)
        .text(`Inicio: ${p.marcas?.inicio ? new Date(p.marcas.inicio).toLocaleString() : '-'}`)
        .text(`Término: ${p.marcas?.termino ? new Date(p.marcas.termino).toLocaleString() : '-'}`);
      if (p.numeroGuia) doc.text(`N° Guía: ${p.numeroGuia}`);
      if (p.numeroSello) doc.text(`N° Sello: ${p.numeroSello}`);
      if (p.incidenteId) doc.text(`Incidente: ${p.incidenteId}${p.incidenteNotas ? ` (${p.incidenteNotas})` : ''}`);
      if (p.observaciones) doc.text(`Obs.: ${p.observaciones}`);
      doc.moveDown(0.5);
    });

    doc.end();
    await new Promise<void>((res) => stream.on('finish', () => res()));
    return rel;
  }

  // ---------------- Métricas SA ----------------
  async metrics(from?: string, to?: string, empresaId?: string) {
    const match: any = {};
    if (from || to) {
      match.fecha = {};
      if (from) match.fecha.$gte = new Date(from);
      if (to) match.fecha.$lte = new Date(to);
    }
    if (empresaId) match.empresaId = empresaId;

    const pipelineBase: PipelineStage[] = [{ $match: match }];
    const groupBy = async (field: string) => {
      const pipeline: PipelineStage[] = [
        ...pipelineBase,
        { $group: { _id: `$${field}`, total: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ];
      return this.servicioModel.aggregate(pipeline).exec();
    };

    const [byTipoServicio, byTipoCarga, bySemi] = await Promise.all([
      groupBy('tipoServicio'),
      groupBy('carga.tipoId'),
      groupBy('equipo.semiTipoId'),
    ]);

    const totalArr = await this.servicioModel.aggregate([...pipelineBase, { $count: 'total' }]).exec();
    const total = totalArr[0]?.total ?? 0;

    return { total, byTipoServicio, byTipoCarga, bySemi };
  }
}
