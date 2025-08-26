'use client';

import * as React from 'react';
import {
  Container, Paper, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Chip, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar,
} from '@mui/material';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

type Conductor = {
  _id: string; rut: string; nombre?: string; apellido?: string; email?: string; fono?: string;
  suspendido?: { motivo?: string; fecha?: string };
  createdAt: string;
};

export default function AdminConductoresPage() {
  const [token, setToken] = React.useState('');
  const [items, setItems] = React.useState<Conductor[]>([]);
  const [open, setOpen] = React.useState(false);
  const [okMsg, setOkMsg] = React.useState('');
  const [errMsg, setErrMsg] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = window.sessionStorage.getItem('npv_token');
      if (t) setToken(t);
    }
  }, []);

  const fetchList = async () => {
    setErrMsg('');
    try {
      const res = await fetch(`${API_URL}/admin/conductores?page=1&limit=50`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Error listando');
      setItems(data.items || []);
    } catch (e:any) { setErrMsg(e.message); }
  };

  React.useEffect(() => { if (token) fetchList(); }, [token]);

  // Crear
  const [f, setF] = React.useState({ rut:'', pin:'', nombre:'', apellido:'', email:'', fono:'' });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setF(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const crear = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/conductores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          rut: f.rut, pin: f.pin, nombre: f.nombre || undefined, apellido: f.apellido || undefined,
          email: f.email || undefined, fono: f.fono || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'No se pudo crear');
      setOkMsg('Conductor creado');
      setOpen(false);
      setF({ rut:'', pin:'', nombre:'', apellido:'', email:'', fono:'' });
      fetchList();
    } catch (e:any) { setErrMsg(e.message); }
  };

  const suspender = async (id: string) => {
    const motivo = typeof window !== 'undefined' ? (window.prompt('Motivo de suspensión:') || '') : '';
    if (!motivo) return;
    try {
      const res = await fetch(`${API_URL}/admin/conductores/${id}/suspender`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ motivo }),
      });
      if (!res.ok) throw new Error('No se pudo suspender');
      setOkMsg('Conductor suspendido');
      fetchList();
    } catch (e:any) { setErrMsg(e.message); }
  };

  const reactivar = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/conductores/${id}/reactivar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('No se pudo reactivar');
      setOkMsg('Conductor reactivado');
      fetchList();
    } catch (e:any) { setErrMsg(e.message); }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Conductores</Typography>

      <Paper sx={{ p:2, mb:3, display:'flex', gap:2 }}>
        <TextField label="Bearer Token" fullWidth value={token} onChange={e=>setToken(e.target.value)} />
        <Button variant="contained" onClick={()=>{ if (typeof window!=='undefined') sessionStorage.setItem('npv_token', token); setOkMsg('Token guardado.'); }}>Guardar</Button>
        <Button variant="outlined" onClick={fetchList}>Refrescar</Button>
        <Button variant="text" onClick={()=>setOpen(true)}>+ Nuevo</Button>
      </Paper>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>RUT</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(c => (
              <TableRow key={c._id} hover>
                <TableCell>{c.rut}</TableCell>
                <TableCell>{[c.nombre, c.apellido].filter(Boolean).join(' ')}</TableCell>
                <TableCell>{c.email || '—'}</TableCell>
                <TableCell>{c.suspendido ? <Chip label="Suspendido" color="warning" /> : <Chip label="Activo" color="success" />}</TableCell>
                <TableCell align="right" style={{ whiteSpace:'nowrap' }}>
                  {c.suspendido
                    ? <Button size="small" variant="outlined" onClick={()=>reactivar(c._id)}>Reactivar</Button>
                    : <Button size="small" variant="outlined" onClick={()=>suspender(c._id)}>Suspender</Button>}
                </TableCell>
              </TableRow>
            ))}
            {items.length===0 && <TableRow><TableCell colSpan={5} align="center">Sin conductores.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nuevo Conductor</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}><TextField name="rut" label="RUT" fullWidth value={f.rut} onChange={onChange} /></Grid>
            <Grid item xs={12} md={6}><TextField name="pin" label="PIN (6 dígitos)" fullWidth value={f.pin} onChange={onChange} /></Grid>
            <Grid item xs={12} md={6}><TextField name="nombre" label="Nombre" fullWidth value={f.nombre} onChange={onChange} /></Grid>
            <Grid item xs={12} md={6}><TextField name="apellido" label="Apellido" fullWidth value={f.apellido} onChange={onChange} /></Grid>
            <Grid item xs={12} md={6}><TextField name="email" label="Email" type="email" fullWidth value={f.email} onChange={onChange} /></Grid>
            <Grid item xs={12} md={6}><TextField name="fono" label="Fono" fullWidth value={f.fono} onChange={onChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={crear}>Crear</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!okMsg} autoHideDuration={4000} onClose={()=>setOkMsg('')}><Alert severity="success">{okMsg}</Alert></Snackbar>
      <Snackbar open={!!errMsg} autoHideDuration={6000} onClose={()=>setErrMsg('')}><Alert severity="error">{errMsg}</Alert></Snackbar>
    </Container>
  );
}
