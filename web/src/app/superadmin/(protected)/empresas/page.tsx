'use client';

import * as React from 'react';
import AppShell from '../../../../components/AppShell';
import {
  Box, Paper, Typography, Stack, Button, TextField, Grid,
  Table, TableHead, TableRow, TableCell, TableBody, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, MenuItem, Alert,
} from '@mui/material';

const NAVY = '#0E2244';
const PLANES = ['30 días', '90 días', '180 días', '360 días'];

export default function EmpresasPage() {
  // Demo estático hasta conectar API
  const rows = [
    { rut: '76.123.456-7', razon: 'Transporte Los Andes Ltda.', cupos: '12 / 20', fin: '2025-10-15', estado: 'ACTIVA' },
    { rut: '77.987.654-3', razon: 'Logística Sur SpA', cupos: '5 / 5', fin: '2025-09-02', estado: 'POR VENCER' },
  ];

  // Modal Nueva Empresa
  const [openNew, setOpenNew] = React.useState(false);
  const [form, setForm] = React.useState({
    rut: '', razon: '', giro: '', direccion:'', comuna:'', region:'',
    contactoNombre:'', contactoEmail:'', contactoFono:'',
    plan:'', cuposMax:'', notas:'',
    adminRut:'', adminNombres:'', adminApellidos:'', adminEmail:'', adminFono:'',
  });
  const [err, setErr] = React.useState<string | null>(null);

  const onChange = (k: string, v: string) => setForm(s => ({ ...s, [k]: v }));

  const validar = () => {
    if (!form.rut || !form.razon) return 'RUT y Razón Social son obligatorios.';
    if (!form.plan) return 'Debes seleccionar un plan de suscripción.';
    if (!form.cuposMax || Number.isNaN(Number(form.cuposMax))) return 'Cupos máximos debe ser número.';
    if (!form.adminRut || !form.adminNombres || !form.adminApellidos || !form.adminEmail) return 'Datos del Admin inicial incompletos.';
    return null;
    // Validación de RUT/email real se agregará al conectar API.
  };

  const crearEmpresa = () => {
    const e = validar();
    if (e) { setErr(e); return; }
    setErr(null);
    // Aquí llamaremos a la API POST /superadmin/empresas
    setOpenNew(false);
  };

  return (
    <AppShell>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: NAVY }}>Empresas</Typography>
            <Typography variant="body2" sx={{ color: '#4C5564' }}>
              Gestiona empresas, cupos y suscripciones.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={()=>setOpenNew(true)}
            sx={{ bgcolor: NAVY, '&:hover': { bgcolor: '#0B1C37' } }}
          >
            + Nueva empresa
          </Button>
        </Stack>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={3}><TextField size="small" label="Buscar por RUT/Nombre" fullWidth /></Grid>
            <Grid item xs={12} md={3}><TextField size="small" label="Estado suscripción" fullWidth /></Grid>
            <Grid item xs={12} md={3}><TextField size="small" label="Suspendida" fullWidth /></Grid>
            <Grid item xs={12} md={3}><Button fullWidth variant="outlined" sx={{ height: 40, borderColor: NAVY, color: NAVY }}>Filtrar</Button></Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>RUT</TableCell>
                <TableCell>Razón Social</TableCell>
                <TableCell>Cupos</TableCell>
                <TableCell>Fin suscripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.rut} hover>
                  <TableCell>{r.rut}</TableCell>
                  <TableCell>{r.razon}</TableCell>
                  <TableCell>{r.cupos}</TableCell>
                  <TableCell>{r.fin}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={r.estado}
                      sx={{ bgcolor: r.estado==='POR VENCER' ? 'rgba(206,155,37,.18)' : 'rgba(14,34,68,.08)', color: NAVY }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" variant="text">Ver</Button>
                      <Button size="small" variant="text">Renovar</Button>
                      <Button size="small" variant="text">Pagos</Button>
                      <Button size="small" variant="text" color="error">Suspender</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Modal Nueva Empresa */}
      <Dialog open={openNew} onClose={()=>setOpenNew(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nueva Empresa</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {err && <Alert severity="error">{err}</Alert>}
            <Typography sx={{ fontWeight: 800, color: NAVY }}>Empresa</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><TextField label="RUT *" value={form.rut} onChange={e=>onChange('rut', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={8}><TextField label="Razón Social *" value={form.razon} onChange={e=>onChange('razon', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Giro" value={form.giro} onChange={e=>onChange('giro', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Dirección" value={form.direccion} onChange={e=>onChange('direccion', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Comuna" value={form.comuna} onChange={e=>onChange('comuna', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Región" value={form.region} onChange={e=>onChange('region', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={4}><TextField label="Contacto - Nombre" value={form.contactoNombre} onChange={e=>onChange('contactoNombre', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={4}><TextField label="Contacto - Email" value={form.contactoEmail} onChange={e=>onChange('contactoEmail', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={4}><TextField label="Contacto - Fono" value={form.contactoFono} onChange={e=>onChange('contactoFono', e.target.value)} fullWidth /></Grid>
            </Grid>

            <Typography sx={{ fontWeight: 800, color: NAVY, mt:1 }}>Suscripción inicial</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField select label="Plan *" value={form.plan} onChange={e=>onChange('plan', e.target.value)} fullWidth>
                  {PLANES.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}><TextField label="Cupos máximos *" value={form.cuposMax} onChange={e=>onChange('cuposMax', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={4}><TextField label="Notas" value={form.notas} onChange={e=>onChange('notas', e.target.value)} fullWidth /></Grid>
            </Grid>

            <Typography sx={{ fontWeight: 800, color: NAVY, mt:1 }}>Admin de Flota inicial</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><TextField label="RUT *" value={form.adminRut} onChange={e=>onChange('adminRut', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={4}><TextField label="Nombres *" value={form.adminNombres} onChange={e=>onChange('adminNombres', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={4}><TextField label="Apellidos *" value={form.adminApellidos} onChange={e=>onChange('adminApellidos', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Email *" value={form.adminEmail} onChange={e=>onChange('adminEmail', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Fono" value={form.adminFono} onChange={e=>onChange('adminFono', e.target.value)} fullWidth /></Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenNew(false)}>Cancelar</Button>
          <Button variant="contained" onClick={crearEmpresa} sx={{ bgcolor: NAVY, '&:hover':{ bgcolor:'#0B1C37' } }}>Crear</Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}
