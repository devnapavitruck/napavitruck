'use client';

import * as React from 'react';
import AppShell from '../../../../components/AppShell';
import {
  Box, Typography, Paper, Stack, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';

const NAVY = '#0E2244';

export default function AuditoriaPage() {
  const rows = [
    { fecha:'2025-08-23 12:10', tipo:'EMPRESA_CREAR', entidad:'Empresa', entidadId:'66c1...a2f', resumen:'Empresa “Logística Sur SpA” creada (cupos=5, plan=90d).' },
  ];

  return (
    <AppShell>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: NAVY }}>Auditoría</Typography>
            <Typography variant="body2" sx={{ color:'#4C5564' }}>Eventos del sistema para trazabilidad y soporte.</Typography>
          </Box>
          <Button variant="outlined" sx={{ borderColor:NAVY, color:NAVY }}>Exportar</Button>
        </Stack>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Stack direction={{ xs:'column', md:'row' }} spacing={1}>
            <TextField size="small" label="Tipo de evento" />
            <TextField size="small" label="Entidad" />
            <TextField size="small" label="Entidad ID" />
            <TextField size="small" label="Rango de fechas" />
            <Button variant="outlined" sx={{ height: 40, borderColor:NAVY, color:NAVY }}>Filtrar</Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Entidad</TableCell>
                <TableCell>Entidad ID</TableCell>
                <TableCell>Resumen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r,i) => (
                <TableRow key={i} hover>
                  <TableCell>{r.fecha}</TableCell>
                  <TableCell>{r.tipo}</TableCell>
                  <TableCell>{r.entidad}</TableCell>
                  <TableCell>{r.entidadId}</TableCell>
                  <TableCell>{r.resumen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </AppShell>
  );
}
