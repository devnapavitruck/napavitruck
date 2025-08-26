'use client';

import * as React from 'react';
import AppShell from '../../../../components/AppShell';
import {
  Box, Typography, Paper, Stack, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';

const NAVY = '#0E2244';

export default function PagosPage() {
  const rows = [
    { fecha:'2025-08-10', empresa:'Transporte Los Andes Ltda.', metodo:'Transferencia', monto:'$ 200.000', dias:30, comprobante:'#TRX-2211', notas:'Renovación 30d' },
  ];

  return (
    <AppShell>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: NAVY }}>Pagos</Typography>
            <Typography variant="body2" sx={{ color:'#4C5564' }}>Registro de pagos por empresa y control de suscripciones.</Typography>
          </Box>
          <Button variant="contained" sx={{ bgcolor:NAVY, '&:hover':{ bgcolor:'#0B1C37' } }}>+ Registrar pago</Button>
        </Stack>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Stack direction={{ xs:'column', md:'row' }} spacing={1}>
            <TextField size="small" label="Empresa" />
            <TextField size="small" label="Rango fechas" />
            <TextField size="small" label="Método" />
            <Button variant="outlined" sx={{ height: 40, borderColor:NAVY, color:NAVY }}>Filtrar</Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Días</TableCell>
                <TableCell>Comprobante</TableCell>
                <TableCell>Notas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r,i) => (
                <TableRow key={i} hover>
                  <TableCell>{r.fecha}</TableCell>
                  <TableCell>{r.empresa}</TableCell>
                  <TableCell>{r.metodo}</TableCell>
                  <TableCell>{r.monto}</TableCell>
                  <TableCell>{r.dias}</TableCell>
                  <TableCell>{r.comprobante}</TableCell>
                  <TableCell>{r.notas}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </AppShell>
  );
}
