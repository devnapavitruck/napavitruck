import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pago, PagoDocument } from './schemas/pago.schema';
import { CreatePagoDto } from './dto/create-pago.dto';
import { Empresa } from '../empresa/schemas/empresa.schema';

@Injectable()
export class PagosService {
  constructor(
    @InjectModel(Pago.name) private readonly pagoModel: Model<PagoDocument>,
    @InjectModel(Empresa.name) private readonly empresaModel: Model<Empresa>,
  ) {}

  async registrar(dto: CreatePagoDto) {
    const empresa = await this.empresaModel.findById(dto.empresaId);
    if (!empresa) throw new BadRequestException('Empresa no encontrada');

    // Sumar días al fin vigente (sin gracia)
    const base =
      empresa.suscripcion?.fin && new Date(empresa.suscripcion.fin) > new Date()
        ? new Date(empresa.suscripcion.fin)
        : new Date();

    const finNuevo = new Date(base);
    finNuevo.setDate(finNuevo.getDate() + dto.planDias);

    // Guardar pago
    const pago = await this.pagoModel.create({
      empresaId: new Types.ObjectId(dto.empresaId),
      fechaPago: new Date(dto.fechaPago),
      numeroFactura: dto.numeroFactura,
      planDias: dto.planDias,
      planValorLista: dto.planValorLista,
      montoPagado: dto.montoPagado,
      metodo: dto.metodo,
      notas: dto.notas,
    });

    // Actualizar/crear subdoc de suscripción (respetando tipos)
    if (!empresa.suscripcion) {
      // cast a any solo para inicializar el subdocumento
      (empresa as any).suscripcion = {
        inicio: new Date(),
        fin: finNuevo,
        estado: 'activa', // <-- minúsculas
      };
    } else {
      if (!empresa.suscripcion.inicio) {
        (empresa.suscripcion as any).inicio = new Date();
      }
      (empresa.suscripcion as any).fin = finNuevo;
      (empresa.suscripcion as any).estado = 'activa'; // <-- minúsculas
    }

    await empresa.save();

    return { ok: true, pagoId: pago._id, suscripcion: empresa.suscripcion };
  }
}
