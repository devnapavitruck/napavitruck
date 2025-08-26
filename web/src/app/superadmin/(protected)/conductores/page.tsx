'use client';

import * as React from 'react';
import AppShell from '../../../../components/AppShell';
import {
  Box, Typography, Paper, Stack, Button, TextField, Table, TableHead, TableRow,
  TableCell, TableBody, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, MenuItem, Alert, ToggleButtonGroup, ToggleButton,
} from '@mui/material';

const NAVY = '#0E2244';

// DEMO: listas para selects (luego de API)
const EMPRESAS = [
  { id:'e1', nombre:'Transporte Los Andes Ltda.' },
  { id:'e2', nombre:'Logística Sur SpA' },
];
const ADMINS_E1 = [
  { id:'u101', nombre:'María Campos' },
  { id:'u102', nombre:'Pedro Fuentes' },
];

export default function ConductoresPage() {
  const rows = [
    { rut: '12.345.678-5', nombre: 'Juan Pérez', tipo: 'DEPENDIENTE', empresa: 'Transporte Los Andes Ltda.', fono: '+56 9 8123 4567', estado: 'ACTIVO' },
    { rut: '19.555.333-2', nombre: 'Ana Soto', tipo: 'INDEPENDIENTE', empresa: '—', fono: '+56 9 8765 4321', estado: 'SUSPENDIDO' },
  ];

  const [openNew, setOpenNew] = React.useState(false);
  const [tipo, setTipo] = React.useState<'DEPENDIENTE' | 'INDEPENDIENTE'>('DEPENDIENTE');
  const [form, setForm] = React.useState({
    empresaId:'', adminId:'', rut:'', nombres:'', apellidos:'', email:'', fono:'', fechaNac:''
  });
  const [err, setErr] = React.useState<string| null>(null);

  const onChange = (k:string, v:string) => setForm(s=>({ ...s, [k]: v }));

  const validar = () => {
    if (!form.rut || !form.nombres || !form.apellidos) return 'RUT, Nombres y Apellidos son obligatorios.';
    if (tipo === 'DEPENDIENTE' && !form.empresaId) return 'Debes seleccionar una empresa para conductor dependiente.';
    // adminId es opcional; si lo eliges, debe pertenecer a esa empresa (validaremos al conectar API)
    return null;
  };

  const crear = () => {
    const e = validar();
    if (e) { setErr(e); return; }
    setErr(null);
    // POST /superadmin/conductores  (tipo DEP/IND, empresaId si DEP, adminId opcional)
    setOpenNew(false);
  };

  return (
    <AppShell>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: NAVY }}>Conductores</Typography>
            <Typography variant="body2" sx={{ color:'#4C5564' }}>
              Dependientes e Independientes. Carga masiva por CSV, exportación de credenciales.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" sx={{ borderColor:NAVY, color:NAVY }}>Cargar CSV</Button>
            <Button variant="contained" sx={{ bgcolor:NAVY, '&:hover':{ bgcolor:'#0B1C37' } }} onClick={()=>setOpenNew(true)}>
              + Agregar
            </Button>
          </Stack>
        </Stack>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Stack direction={{ xs:'column', md:'row' }} spacing={1}>
            <TextField size="small" label="Buscar RUT/Nombre" />
            <TextField size="small" label="Tipo (Dep/Ind)" />
            <TextField size="small" label="Empresa" />
            <TextField size="small" label="Estado" />
            <Button variant="outlined" sx={{ height: 40, borderColor:NAVY, color:NAVY }}>Filtrar</Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>RUT</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Fono</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.rut} hover>
                  <TableCell>{r.rut}</TableCell>
                  <TableCell>{r.nombre}</TableCell>
                  <TableCell>{r.tipo}</TableCell>
                  <TableCell>{r.empresa}</TableCell>
                  <TableCell>{r.fono}</TableCell>
                  <TableCell>
                    <Chip size="small" label={r.estado} sx={{ bgcolor:'rgba(14,34,68,.08)', color:NAVY }} />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" variant="text">Credenciales</Button>
                      <Button size="small" variant="text">Editar</Button>
                      <Button size="small" variant="text" color="error">Suspender</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Modal Nuevo Conductor */}
      <Dialog open={openNew} onClose={()=>setOpenNew(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nuevo Conductor</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {err && <Alert severity="error">{err}</Alert>}

            <ToggleButtonGroup
              exclusive
              value={tipo}
              onChange={(_, v) => v && setTipo(v)}
              size="small"
              sx={{ alignSelf:'flex-start' }}
            >
              <ToggleButton value="DEPENDIENTE">Dependiente</ToggleButton>
              <ToggleButton value="INDEPENDIENTE">Independiente</ToggleButton>
            </ToggleButtonGroup>

            <Grid container spacing={2}>
              {tipo === 'DEPENDIENTE' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField select label="Empresa *" value={form.empresaId} onChange={e=>onChange('empresaId', e.target.value)} fullWidth>
                      {EMPRESAS.map(e => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select label="Admin asignado (opcional)" value={form.adminId} onChange={e=>onChange('adminId', e.target.value)} fullWidth>
                      <MenuItem value="">—</MenuItem>
                      {ADMINS_E1.map(a => <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>)}
                    </TextField>
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={4}><TextField label="RUT *" value={form.rut} onChange={e=>onChange('rut', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={4}><TextField label="Nombres *" value={form.nombres} onChange={e=>onChange('nombres', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={4}><TextField label="Apellidos *" value={form.apellidos} onChange={e=>onChange('apellidos', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Email" value={form.email} onChange={e=>onChange('email', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField label="Fono" value={form.fono} onChange={e=>onChange('fono', e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField type="date" label="Fecha de nacimiento" InputLabelProps={{ shrink: true }} value={form.fechaNac} onChange={e=>onChange('fechaNac', e.target.value)} fullWidth /></Grid>
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
