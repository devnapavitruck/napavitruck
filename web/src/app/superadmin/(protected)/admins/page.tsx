'use client';

import * as React from 'react';
import AppShell from '../../../../components/AppShell';
import {
  Box, Typography, Paper, Stack, Button, TextField, Table, TableHead,
  TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, MenuItem, Alert,
} from '@mui/material';

const NAVY = '#0E2244';

// DEMO: empresas para selector (luego API)
const EMPRESAS = [
  { id:'e1', nombre:'Transporte Los Andes Ltda.' },
  { id:'e2', nombre:'Logística Sur SpA' },
];

export default function AdminsPage() {
  const rows = [
    { rut: '14.222.333-4', nombre: 'María Campos', empresa: 'Transporte Los Andes Ltda.', email: 'maria@tla.cl', estado: 'ACTIVO' },
  ];

  const [openNew, setOpenNew] = React.useState(false);
  const [form, setForm] = React.useState({
    empresaId:'', rut:'', nombres:'', apellidos:'', email:'', fono:''
  });
  const [err, setErr] = React.useState<string| null>(null);
  const onChange = (k:string, v:string) => setForm(s=>({ ...s, [k]: v }));

  const validar = () => {
    if (!form.empresaId) return 'Debes seleccionar una empresa.';
    if (!form.rut || !form.nombres || !form.apellidos || !form.email) return 'Completa los campos obligatorios.';
    return null;
  };

  const crear = () => {
    const e = validar();
    if (e) { setErr(e); return; }
    setErr(null);
    // POST /superadmin/admins
    setOpenNew(false);
  };

  return (
    <AppShell>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: NAVY }}>Admins de flota</Typography>
            <Typography variant="body2" sx={{ color:'#4C5564' }}>
              Usuarios administradores por empresa (rol ADMIN_EDT).
            </Typography>
          </Box>
          <Button variant="contained" sx={{ bgcolor: NAVY, '&:hover': { bgcolor:'#0B1C37' } }} onClick={()=>setOpenNew(true)}>
            + Nuevo admin
          </Button>
        </Stack>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Stack direction={{ xs:'column', md:'row' }} spacing={1}>
            <TextField size="small" label="Buscar RUT/Nombre" />
            <TextField size="small" label="Empresa" />
            <Button variant="outlined" sx={{ height: 40, borderColor:NAVY, color:NAVY }}>Filtrar</Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>RUT</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.rut} hover>
                  <TableCell>{r.rut}</TableCell>
                  <TableCell>{r.nombre}</TableCell>
                  <TableCell>{r.empresa}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{r.estado}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" variant="text">Ver</Button>
                      <Button size="small" variant="text">Reset PIN</Button>
                      <Button size="small" variant="text" color="error">Suspender</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Modal Nuevo Admin */}
      <Dialog open={openNew} onClose={()=>setOpenNew(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nuevo Admin de flota</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {err && <Alert severity="error">{err}</Alert>}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField select label="Empresa *" value={form.empresaId} onChange={e=>onChange('empresaId', e.target.value)} fullWidth>
                  {EMPRESAS.map(e => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}><TextField label="RUT *" value={form.rut} onChange={e=>onChange('rut', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Nombres *" value={form.nombres} onChange={e=>onChange('nombres', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Apellidos *" value={form.apellidos} onChange={e=>onChange('apellidos', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Email *" value={form.email} onChange={e=>onChange('email', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Fono" value={form.fono} onChange={e=>onChange('fono', e.target.value)} fullWidth /></Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenNew(false)}>Cancelar</Button>
          <Button variant="contained" onClick={crear} sx={{ bgcolor: NAVY, '&:hover':{ bgcolor:'#0B1C37' } }}>Crear</Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}
