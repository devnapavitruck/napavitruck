'use client';

import * as React from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Chip, Snackbar, Alert,
} from '@mui/material';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

type Empresa = {
  _id: string;
  rut: string;
  razonSocial: string;
  cuposMax: number;
  cuposOcupados: number;
  suscripcion: { inicio: string; fin: string; estado: 'activa'|'vencida' };
  suspendida?: { motivo?: string; fecha?: string };
  createdAt: string;
};

export default function EmpresasListPage() {
  const [token, setToken] = React.useState<string>('');
  const [items, setItems] = React.useState<Empresa[]>([]);
  const [okMsg, setOkMsg] = React.useState('');
  const [errMsg, setErrMsg] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = window.sessionStorage.getItem('npv_token');
      if (t) setToken(t);
    }
  }, []);

  const saveToken = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('npv_token', token);
    }
    setOkMsg('Token guardado.');
  };

  const fetchList = async () => {
    setErrMsg('');
    try {
      const res = await fetch(`${API_URL}/superadmin/empresas?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Error listando');
      setItems(data.items || []);
    } catch (e:any) { setErrMsg(e.message); }
  };

  const suspender = async (id: string) => {
    const motivo = typeof window !== 'undefined' ? (window.prompt('Motivo de suspensión:') || '') : '';
    if (!motivo) return;
    try {
      const res = await fetch(`${API_URL}/superadmin/empresas/${id}/suspender`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ motivo }),
      });
      if (!res.ok) throw new Error('No se pudo suspender');
      setOkMsg('Empresa suspendida');
      fetchList();
    } catch (e:any) { setErrMsg(e.message); }
  };

  const reactivar = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/superadmin/empresas/${id}/reactivar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('No se pudo reactivar');
      setOkMsg('Empresa reactivada');
      fetchList();
    } catch (e:any) { setErrMsg(e.message); }
  };

  React.useEffect(() => {
    if (token) fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Empresas</Typography>

      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Bearer Token"
          fullWidth
          value={token}
          onChange={e => setToken(e.target.value)}
        />
        <Button variant="contained" onClick={saveToken}>Guardar</Button>
        <Button variant="outlined" onClick={fetchList}>Refrescar</Button>
        <Button variant="text" href="/superadmin/empresas/nueva">+ Nueva</Button>
      </Paper>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>RUT</TableCell>
              <TableCell>Razón Social</TableCell>
              <TableCell>Suscripción</TableCell>
              <TableCell>Cupos</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(e => (
              <TableRow key={e._id} hover>
                <TableCell>{e.rut}</TableCell>
                <TableCell>{e.razonSocial}</TableCell>
                <TableCell>{new Date(e.suscripcion.inicio).toLocaleDateString()} → {new Date(e.suscripcion.fin).toLocaleDateString()}</TableCell>
                <TableCell>{e.cuposOcupados}/{e.cuposMax}</TableCell>
                <TableCell>
                  {e.suspendida
                    ? <Chip label="Suspendida" color="warning" />
                    : <Chip label={e.suscripcion.estado === 'activa' ? 'Activa' : 'Vencida'} color={e.suscripcion.estado === 'activa' ? 'success' : 'default'} />}
                </TableCell>
                <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>
                  {e.suspendida ? (
                    <Button size="small" variant="outlined" onClick={() => reactivar(e._id)}>Reactivar</Button>
                  ) : (
                    <Button size="small" variant="outlined" onClick={() => suspender(e._id)}>Suspender</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow><TableCell colSpan={6}><Box p={2} textAlign="center">Sin empresas.</Box></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar open={!!okMsg} autoHideDuration={4000} onClose={() => setOkMsg('')}>
        <Alert severity="success" onClose={() => setOkMsg('')}>{okMsg}</Alert>
      </Snackbar>
      <Snackbar open={!!errMsg} autoHideDuration={6000} onClose={() => setErrMsg('')}>
        <Alert severity="error" onClose={() => setErrMsg('')}>{errMsg}</Alert>
      </Snackbar>
    </Container>
  );
}
