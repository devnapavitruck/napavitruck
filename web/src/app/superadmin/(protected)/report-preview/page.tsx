'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Box, Typography, Divider, Stack, Chip, Grid, Paper, Table, TableHead, TableBody, TableRow, TableCell,
} from '@mui/material';

import logoApp from '@/app/images/logoapp.png'; // ya la tienes

// --- Colores corporativos ---
const NAVY = '#0E2244';
const GOLD = '#CE9B25';

// Datos MOCK para visualización (cuando conectemos a API, los remplazamos por fetch)
const mock = {
  id: 'SV-65fabc123',
  tipoServicio: 'ONE_WAY', // o ROUND_TRIP
  fecha: new Date().toLocaleString(),
  equipo: {
    tractoPatente: 'ABCD12',
    semiPatente: 'WXYZ34',
    semiTipoId: 'RAMPLA_PLANA',
  },
  carga: {
    tipoId: 'CONT_20_STD',
    unidad: 'UNIDAD',
    cantidad: undefined,
    numeroContenedor: 'MSCU1234567',
    numeroRotainer: undefined,
    contenedores: undefined, // o [{numeroContenedor:'...', numeroRotainer:'...'}, ...] para 2x20
    peligrosa: false,
    clasePeligrosa: undefined,
    nUN: undefined,
  },
  operacion: [
    {
      tipo: 'CARGA',
      lugar: 'Puerto Angamos - Andén 3',
      marcas: {
        presentacion: new Date().toLocaleString(),
        inicio: new Date().toLocaleString(),
        termino: new Date().toLocaleString(),
      },
      numeroGuia: 'G-000123',
      numeroSello: 'SEL-9981',
      incidenteId: 'SIN_NOVEDAD',
      incidenteNotas: '',
      observaciones: 'Todo conforme.',
      fotosGuia: [], // miniatura se muestra si hay al menos 1
      fotosCarga: [],
    },
    {
      tipo: 'DESCARGA',
      lugar: 'Cliente ACME - Bodega Norte',
      marcas: {
        presentacion: new Date().toLocaleString(),
        inicio: new Date().toLocaleString(),
        termino: new Date().toLocaleString(),
      },
      numeroGuia: 'G-000124 (FIRMADA)',
      numeroSello: 'SEL-9981',
      incidenteId: 'SIN_NOVEDAD',
      incidenteNotas: '',
      observaciones: 'Entrega OK.',
      fotosGuia: [], // aquí debería ir la FIRMADA (en PDF real es obligatoria)
      fotosCarga: [],
    },
  ],
};

export default function ReportPreviewPage() {
  return (
    <Box sx={{ bgcolor: '#f5f6f8', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 900, // ~A4 a 96dpi (210mm ~ 794px) + espaciado
          mx: 'auto',
        }}
      >
        {/* Simulación hoja A4 */}
        <Paper elevation={6} sx={{ position: 'relative', overflow: 'hidden' }}>
          {/* Header navy */}
          <Box sx={{ height: 76, bgcolor: NAVY, display: 'flex', alignItems: 'center', px: 3 }}>
            <Image src={logoApp} alt="NapaviTruck" width={72} height={72} style={{ objectFit: 'contain' }} />
            <Typography sx={{ color: 'white', ml: 2, fontWeight: 700, letterSpacing: 0.3 }} variant="h6">
              Informe de Servicio — NapaviTruck
            </Typography>
          </Box>

          {/* Watermark */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-28deg)',
              opacity: 0.06,
              pointerEvents: 'none',
            }}
          >
            <Image src={logoApp} alt="wm" width={700} height={700} style={{ objectFit: 'contain' }} />
          </Box>

          {/* Contenido */}
          <Box sx={{ p: 3 }}>
            {/* Resumen */}
            <SectionTitle title="Resumen" />
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Info label="ID Servicio" value={mock.id} />
              <Info label="Tipo" value={mock.tipoServicio} />
              <Info label="Fecha" value={mock.fecha} />
              <Chip label="FINALIZADO (preview)" sx={{ bgcolor: GOLD, color: '#111', fontWeight: 600 }} />
            </Stack>

            <Hr />

            {/* Equipo */}
            <SectionTitle title="Equipo" />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><Info label="Tracto" value={mock.equipo.tractoPatente} /></Grid>
              <Grid item xs={12} md={4}><Info label="Semi" value={mock.equipo.semiPatente} /></Grid>
              <Grid item xs={12} md={4}><Info label="Tipo Semi" value={mock.equipo.semiTipoId} /></Grid>
            </Grid>

            <Hr />

            {/* Carga */}
            <SectionTitle title="Carga" />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><Info label="Tipo de Carga" value={mock.carga.tipoId} /></Grid>
              <Grid item xs={12} md={4}><Info label="Unidad" value={mock.carga.unidad} /></Grid>
              {mock.carga.cantidad !== undefined && (
                <Grid item xs={12} md={4}><Info label="Cantidad" value={String(mock.carga.cantidad)} /></Grid>
              )}
              {mock.carga.numeroContenedor && (
                <Grid item xs={12} md={6}><Info label="N° Contenedor" value={mock.carga.numeroContenedor} /></Grid>
              )}
              {mock.carga.numeroRotainer && (
                <Grid item xs={12} md={6}><Info label="N° Rotainer" value={mock.carga.numeroRotainer} /></Grid>
              )}
            </Grid>
            {Array.isArray(mock.carga.contenedores) && mock.carga.contenedores.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {mock.carga.contenedores.map((c, i) => (
                  <Typography key={i} variant="body2">
                    Contenedor #{i + 1}: <b>{c.numeroContenedor}</b>{c.numeroRotainer ? ` / Rotainer: ${c.numeroRotainer}` : ''}
                  </Typography>
                ))}
              </Box>
            )}

            <Hr />

            {/* Operación */}
            <SectionTitle title="Operación" />
            <Table size="small" aria-label="Tabla de operación">
              <TableHead>
                <TableRow sx={{ '& th': { bgcolor: '#fafafa' } }}>
                  <TableCell><b>Punto</b></TableCell>
                  <TableCell><b>Lugar</b></TableCell>
                  <TableCell><b>Presentación</b></TableCell>
                  <TableCell><b>Inicio</b></TableCell>
                  <TableCell><b>Término</b></TableCell>
                  <TableCell><b>Guía</b></TableCell>
                  <TableCell><b>Sello</b></TableCell>
                  <TableCell><b>Incidente</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mock.operacion.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell>{p.tipo}</TableCell>
                    <TableCell>{p.lugar}</TableCell>
                    <TableCell>{p.marcas?.presentacion ?? '-'}</TableCell>
                    <TableCell>{p.marcas?.inicio ?? '-'}</TableCell>
                    <TableCell>{p.marcas?.termino ?? '-'}</TableCell>
                    <TableCell>{p.numeroGuia ?? '-'}</TableCell>
                    <TableCell>{p.numeroSello ?? '-'}</TableCell>
                    <TableCell>{p.incidenteId ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Observaciones por punto + miniatura guía (si existiera) */}
            <Box sx={{ mt: 2 }}>
              {mock.operacion.map((p, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 2, mb: 1.5 }}>
                  <Typography sx={{ fontWeight: 700, color: NAVY, mb: 0.5 }}>
                    {i + 1}) {p.tipo} — {p.lugar}
                  </Typography>
                  {p.observaciones && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <b>Obs.:</b> {p.observaciones}
                    </Typography>
                  )}
                  {/* Miniatura de guía (si tuviéramos URL) */}
                  {/* <Image src={someUrl} alt="Guía" width={220} height={140} /> */}
                  <Typography variant="caption" color="text.secondary">
                    Miniatura de guía aparecería aquí si hay foto adjunta en {p.tipo}.
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* Footer simulado */}
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                Generado: {new Date().toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Vista previa (no es el PDF real)
              </Typography>
            </Stack>
          </Box>
        </Paper>

        {/* Tips */}
        <Box sx={{ mt: 2, color: '#6b7280' }}>
          <Typography variant="body2">
            Sugerencia: para “Imprimir → Guardar como PDF”, usa tamaño A4, márgenes 10–12&nbsp;mm, sin encabezados/foots del navegador.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="h6" sx={{ color: NAVY, fontWeight: 800, letterSpacing: 0.2 }}>{title}</Typography>
      <Divider sx={{ borderColor: GOLD, borderBottomWidth: 2, width: 180 }} />
    </Box>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <Stack spacing={0.2} sx={{ minWidth: 160 }}>
      <Typography variant="caption" sx={{ color: '#6b7280' }}>{label}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>{value ?? '-'}</Typography>
    </Stack>
  );
}

function Hr() {
  return <Divider sx={{ my: 2, borderColor: GOLD, borderBottomWidth: 1 }} />;
}
