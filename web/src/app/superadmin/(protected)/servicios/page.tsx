'use client';

import * as React from 'react';
import AppShell from '../../../../components/AppShell';
import {
  Box, Typography, Paper, Stack, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Chip,
} from '@mui/material';

const NAVY = '#0E2244';

export default function ServiciosPage() {
  const rows = [
    { codigo:'SV-1001', empresa:'Transporte Los Andes Ltda.', conductor:'Juan Pérez', origen:'Santiago', destino:'Rancagua', fecha:'2025-08-23 09:30', estado:'PROGRAMADO' },
    { codigo:'SV-0998', empresa:'Logística Sur SpA', conductor:'Ana Soto', origen:'Rancagua', destino:'Santiago', fecha:'2025-08-23 08:00', estado:'EN_TRANSITO' },
  ];

  return (
    <AppShell>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: NAVY }}>Servicios</Typography>
            <Typography variant="body2" sx={{ color:'#4C5564' }}>Vista global solo lectura (15 estados operativos).</Typography>
          </Box>
          <Button variant="outlined" sx={{ borderColor:NAVY, color:NAVY }}>Exportar</Button>
        </Stack>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Stack direction={{ xs:'column', md:'row' }} spacing={1}>
            <TextField size="small" label="Buscar por código" />
            <TextField size="small" label="Empresa" />
            <TextField size="small" label="Conductor" />
            <TextField size="small" label="Estado" />
            <Button variant="outlined" sx={{ height: 40, borderColor:NAVY, color:NAVY }}>Filtrar</Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Conductor</TableCell>
                <TableCell>Origen</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell>Fecha/Hora</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.codigo} hover>
                  <TableCell>{r.codigo}</TableCell>
                  <TableCell>{r.empresa}</TableCell>
                  <TableCell>{r.conductor}</TableCell>
                  <TableCell>{r.origen}</TableCell>
                  <TableCell>{r.destino}</TableCell>
                  <TableCell>{r.fecha}</TableCell>
                  <TableCell><Chip size="small" label={r.estado} sx={{ bgcolor:'rgba(14,34,68,.08)', color: NAVY }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </AppShell>
  );
}
