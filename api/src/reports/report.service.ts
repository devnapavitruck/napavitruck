import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import puppeteer from 'puppeteer';

// Tipos mínimos para no acoplar a todo el dominio:
type ConductorLite = { rut?: string; nombre?: string; apellido?: string; fono?: string } | null;

// Helper fecha Chile
function fmt(dt?: Date | string | null) {
  if (!dt) return '–';
  const d = new Date(dt);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dd = pad(d.getDate());
  const mm = pad(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${dd}-${mm}-${yyyy} ${hh}:${mi}`;
}

function dur(from?: Date | string | null, to?: Date | string | null) {
  if (!from || !to) return '–';
  const ms = new Date(to).getTime() - new Date(from).getTime();
  if (ms <= 0) return '0 min';
  const min = Math.floor(ms / 60000);
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h} h ${m} min` : `${m} min`;
}

@Injectable()
export class ReportService {
  private ensureDir(p: string) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  }

  private fileUrlFromRelative(relPath: string) {
    // relPath vendrá como '/uploads/…'. Lo llevamos a ruta absoluta del FS y luego a file://
    const abs = path.join(process.cwd(), relPath.replace(/^\//, ''));
    return pathToFileURL(abs).toString();
  }

  private loadWatermarkDataUri(): string | null {
    try {
      const wm = path.join(process.cwd(), 'src', 'assets', 'brand', '01-ImagotipoPrincipal.svg');
      const svg = fs.readFileSync(wm);
      const b64 = Buffer.from(svg).toString('base64');
      return `data:image/svg+xml;base64,${b64}`;
    } catch {
      return null;
    }
  }

  // Genera el HTML completo (contenido + anexos)
  private buildHtml(opts: {
    servicio: any;
    conductor: ConductorLite;
    guiaDescargaUrl?: string | null;
    fotoCargaUrl?: string | null;
  }) {
    const NAVY = '#0E2244';
    const GOLD = '#CE9B25';
    const wm = this.loadWatermarkDataUri();

    const s = opts.servicio;
    const c = opts.conductor;

    // Operación: buscamos puntos
    const puntos: any[] = Array.isArray(s.operacion) ? s.operacion : [];
    const carga = puntos.find(p => p.tipo === 'CARGA');
    const inter = puntos.find(p => p.tipo === 'INTERMEDIO');
    const desc  = puntos.find(p => p.tipo === 'DESCARGA');

    // Ayuda para filas de operación
    const opRow = (p?: any, etiqueta?: string) => {
      if (!p) return '';
      const pres = p?.marcas?.presentacion;
      const ini  = p?.marcas?.inicio;
      const fin  = p?.marcas?.termino;
      const durFaena = dur(pres, fin);     // presentación -> término
      const durOp    = dur(ini,  fin);     // inicio -> término
      return `
        <tr>
          <td><b>${etiqueta ?? p.tipo}</b></td>
          <td>${p.lugar || '–'}</td>
          <td>${fmt(pres)}</td>
          <td>${fmt(ini)}</td>
          <td>${fmt(fin)}</td>
          <td>${durFaena}</td>
          <td>${durOp}</td>
          <td>${p.numeroGuia ?? '–'}</td>
          <td>${p.numeroSello ?? '–'}</td>
          <td>${p.incidenteId ? (p.incidenteNotas ? `${p.incidenteId} (${p.incidenteNotas})` : p.incidenteId) : '–'}</td>
        </tr>
      `;
    };

    // Carga (cantidad vs contenedor/es)
    const cga = s.carga ?? {};
    const contList = Array.isArray(cga.contenedores) ? cga.contenedores : [];
    const contHtml = contList.length
      ? contList.map((it: any, i: number) =>
          `<div>Contenedor #${i + 1}: <b>${it.numeroContenedor ?? '–'}</b>${it.numeroRotainer ? ` / Rotainer: <b>${it.numeroRotainer}</b>` : ''}</div>`
        ).join('')
      : (cga.numeroContenedor
          ? `<div>N° Contenedor: <b>${cga.numeroContenedor}</b>${cga.numeroRotainer ? ` / Rotainer: <b>${cga.numeroRotainer}</b>` : ''}</div>`
          : `<div>Cantidad: <b>${(cga.cantidad ?? '–')} ${cga.unidad ?? ''}</b></div>`);

    const guiaPage = opts.guiaDescargaUrl ? `
      <div class="page-break"></div>
      <div class="fullpage">
        <h2>Anexo – Guía de despacho (DESCARGA)</h2>
        <img class="fullimg" src="${opts.guiaDescargaUrl}" alt="Guía de despacho"/>
      </div>
    ` : '';

    const fotoCargaPage = opts.fotoCargaUrl ? `
      <div class="page-break"></div>
      <div class="fullpage">
        <h2>Anexo – Foto de la carga</h2>
        <img class="fullimg" src="${opts.fotoCargaUrl}" alt="Foto de carga"/>
      </div>
    ` : '';

    return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 12mm; }
  body { font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; color: #111; }
  .header { background: ${NAVY}; color: #fff; padding: 12px 16px; border-radius: 8px; }
  .title { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: .2px; }
  .muted { color: #6b7280; }

  .card { border: 1px solid #eee; border-radius: 10px; padding: 14px; margin-top: 14px; }
  .section h3 { color: ${NAVY}; margin: 0 0 6px; font-size: 16px; font-weight: 800; }
  .hr { height: 2px; background: ${GOLD}; width: 140px; margin: 6px 0 10px; }

  .pair { display: grid; grid-template-columns: 180px 1fr; gap: 8px; margin: 4px 0; }
  .label { font-size: 11px; color: #6b7280; }
  .value { font-size: 12px; font-weight: 600; }

  table { border-collapse: collapse; width: 100%; font-size: 11px; }
  th, td { border: 1px solid #e5e7eb; padding: 6px 8px; vertical-align: top; }
  th { background: #f8fafc; font-weight: 700; }

  .wm {
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-28deg);
    opacity: 0.06; z-index: 0; width: 720px; height: 720px;
  }
  .page { position: relative; z-index: 1; }
  .page-break { page-break-before: always; }
  .fullpage h2 { color: ${NAVY}; margin: 0 0 8px; font-size: 16px; }
  .fullimg { width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 6px; }

  .footer { margin-top: 8px; font-size: 10px; color: #6b7280; display: flex; justify-content: space-between; }
</style>
</head>
<body>
  ${wm ? `<img class="wm" src="${wm}" alt="wm"/>` : ''}

  <div class="page">
    <div class="header"><h1 class="title">Informe de Servicio — NapaviTruck</h1></div>

    <!-- Resumen -->
    <div class="card section">
      <h3>Resumen</h3><div class="hr"></div>
      <div class="pair"><div class="label">ID Servicio</div><div class="value">${s._id}</div></div>
      <div class="pair"><div class="label">Tipo</div><div class="value">${s.tipoServicio}</div></div>
      <div class="pair"><div class="label">Fecha</div><div class="value">${fmt(s.fecha)}</div></div>
    </div>

    <!-- Conductor -->
    <div class="card section">
      <h3>Conductor</h3><div class="hr"></div>
      <div class="pair"><div class="label">Nombre</div><div class="value">${(c?.nombre ?? '–')} ${(c?.apellido ?? '')}</div></div>
      <div class="pair"><div class="label">RUT</div><div class="value">${c?.rut ?? '–'}</div></div>
      <div class="pair"><div class="label">Fono</div><div class="value">${c?.fono ?? '–'}</div></div>
    </div>

    <!-- Equipo -->
    <div class="card section">
      <h3>Tracto camión</h3><div class="hr"></div>
      <div class="pair"><div class="label">Patente</div><div class="value">${s.equipo?.tractoPatente ?? '–'}</div></div>
      <div class="pair"><div class="label">Marca</div><div class="value">${s.equipo?.tractoMarca ?? '–'}</div></div>
      <div class="pair"><div class="label">Modelo / Año</div><div class="value">${s.equipo?.tractoModelo ?? '–'} ${s.equipo?.tractoAnio ? `/ ${s.equipo.tractoAnio}` : ''}</div></div>
    </div>

    <div class="card section">
      <h3>Semirremolque</h3><div class="hr"></div>
      <div class="pair"><div class="label">Patente</div><div class="value">${s.equipo?.semiPatente ?? '–'}</div></div>
      <div class="pair"><div class="label">Tipo</div><div class="value">${s.equipo?.semiTipoId ?? '–'}</div></div>
      <div class="pair"><div class="label">Marca / Año</div><div class="value">${s.equipo?.semiMarca ?? '–'} ${s.equipo?.semiAnio ? `/ ${s.equipo.semiAnio}` : ''}</div></div>
    </div>

    <!-- Carga -->
    <div class="card section">
      <h3>Carga</h3><div class="hr"></div>
      <div class="pair"><div class="label">Tipo de carga</div><div class="value">${cga.tipoId ?? '–'}</div></div>
      <div class="pair"><div class="label">N° Guía</div><div class="value">${cga.numeroGuia ?? (desc?.numeroGuia ?? '–')}</div></div>
      <div class="pair"><div class="label">N° Sello</div><div class="value">${cga.numeroSello ?? (desc?.numeroSello ?? '–')}</div></div>
      ${contHtml}
      ${cga.peligrosa ? `<div class="pair"><div class="label">Peligrosa</div><div class="value">Sí (Clase: ${cga.clasePeligrosa ?? '–'}, N° UN: ${cga.nUN ?? '–'})</div></div>` : ''}
    </div>

    <!-- Operación -->
    <div class="card section">
      <h3>Operación</h3><div class="hr"></div>
      <table>
        <thead>
          <tr>
            <th>Punto</th>
            <th>Lugar</th>
            <th>Presentación</th>
            <th>Inicio</th>
            <th>Término</th>
            <th>Pres.→Térm.</th>
            <th>Inicio→Térm.</th>
            <th>N° Guía</th>
            <th>N° Sello</th>
            <th>Incidente</th>
          </tr>
        </thead>
        <tbody>
          ${opRow(carga, 'CARGA')}
          ${inter ? opRow(inter, 'INTERMEDIO') : ''}
          ${opRow(desc, 'DESCARGA')}
        </tbody>
      </table>
      ${[carga, inter, desc].filter(Boolean).map((p: any) => p?.observaciones ? `
        <div class="pair" style="margin-top:6px">
          <div class="label">Obs. ${p.tipo}</div><div class="value">${p.observaciones}</div>
        </div>
      ` : '').join('')}
    </div>

    <div class="footer">
      <div>Generado: ${fmt(new Date())}</div>
      <div>© NapaviTruck</div>
    </div>
  </div>

  ${guiaPage}
  ${fotoCargaPage}
</body>
</html>`;
  }

  /**
   * Genera el PDF y devuelve la RUTA RELATIVA web (/uploads/reports/ID.pdf)
   */
  async generateServicioPdf(servicio: any, conductor: ConductorLite): Promise<string> {
    const reportsDir = path.join(process.cwd(), 'uploads', 'reports');
    this.ensureDir(reportsDir);
    const rel = `/uploads/reports/${servicio._id}.pdf`;
    const full = path.join(process.cwd(), rel);

    // Buscar anexos
    const puntos: any[] = Array.isArray(servicio.operacion) ? servicio.operacion : [];
    const pDesc = puntos.find(p => p.tipo === 'DESCARGA');
    const pCarga = puntos.find(p => p.tipo === 'CARGA');

    const guiaDescargaUrl = pDesc?.fotosGuia?.length
      ? this.fileUrlFromRelative(pDesc.fotosGuia[0])
      : null;

    // Foto de carga: priorizamos CARGA, si no, la primera que exista
    const fotoCargaUrl = pCarga?.fotosCarga?.length
      ? this.fileUrlFromRelative(pCarga.fotosCarga[0])
      : (pDesc?.fotosCarga?.length ? this.fileUrlFromRelative(pDesc.fotosCarga[0]) : null);

    const html = this.buildHtml({
      servicio,
      conductor,
      guiaDescargaUrl,
      fotoCargaUrl,
    });

    const browser = await puppeteer.launch({
      // en algunos entornos de CI necesitarás no-sandbox:
      args: ['--no-sandbox', '--font-render-hinting=medium'],
    });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: full,
        format: 'A4',
        printBackground: true,
        margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
      });
    } finally {
      await browser.close();
    }
    return rel;
  }
}
