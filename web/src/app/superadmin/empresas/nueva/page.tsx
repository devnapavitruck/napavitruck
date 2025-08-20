'use client';

import * as React from 'react';
import {
  Box, Container, Paper, TextField, Grid, Typography, Button, Alert, Snackbar, Divider,
} from '@mui/material';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export default function NuevaEmpresaPage() {
  const [token, setToken] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [okMsg, setOkMsg] = React.useState<string>('');
  const [errMsg, setErrMsg] = React.useState<string>('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = window.sessionStorage.getItem('npv_token');
      if (t) setToken(t);
    }
  }, []);

  const [form, setForm] = React.useState({
    rut: '',
    razonSocial: '',
    contactoNombre: '',
    contactoEmail: '',
    contactoFono: '',
    cuposMax: 1,
    suscripcionInicio: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
    suscripcionDias: 30,

    adminRut: '',
    adminPin: '',
    adminNombre: '',
    adminApellido: '',
    adminEmail: '',
    adminFono: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'cuposMax' || name === 'suscripcionDias' ? Number(value) : value,
    }));
  };

  const saveToken = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('npv_token', token);
    }
    setOkMsg('Token guardado para esta sesión.');
  };

  const submit = async () => {
    setOkMsg('');
    setErrMsg('');
    if (!token) {
      setErrMsg('Pega tu Bearer token (login en Swagger) antes de crear.');
      return;
    }
    const payload = {
      rut: form.rut,
      razonSocial: form.razonSocial,
      contactoNombre: form.contactoNombre || undefined,
      contactoEmail: form.contactoEmail || undefined,
      contactoFono: form.contactoFono || undefined,
      cuposMax: Number(form.cuposMax) || 1,
      suscripcionInicio: form.suscripcionInicio, // yyyy-mm-dd aceptado por DTO IsDateString
      suscripcionDias: Number(form.suscripcionDias) || 30,
      adminRut: form.adminRut,
      adminPin: form.adminPin, // 6 dígitos
      adminNombre: form.adminNombre,
      adminApellido: form.adminApellido,
      adminEmail: form.adminEmail,
      adminFono: form.adminFono || undefined,
    };

    try {
      setLoading(true);
      const url = `${API_URL}/superadmin/empresas`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Error al crear empresa');
      setOkMsg(`Empresa creada: ${data?.empresa?.razonSocial || ''}`);
      setForm(f => ({ ...f, rut: '', razonSocial: '' }));
    } catch (e: any) {
      setErrMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Crear Empresa (SUPERADMIN)</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField
              label="Bearer Token (pégalo desde /docs → login)"
              fullWidth
              value={token}
              onChange={e => setToken(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button onClick={saveToken} variant="contained" fullWidth>Guardar Token</Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Datos de la Empresa</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><TextField name="rut" label="RUT Empresa" fullWidth value={form.rut} onChange={onChange} /></Grid>
          <Grid item xs={12} md={6}><TextField name="razonSocial" label="Razón Social" fullWidth value={form.razonSocial} onChange={onChange} /></Grid>
          <Grid item xs={12} md={4}><TextField name="contactoNombre" label="Contacto - Nombre" fullWidth value={form.contactoNombre} onChange={onChange} /></Grid>
          <Grid item xs={12} md={4}><TextField name="contactoEmail" label="Contacto - Email" type="email" fullWidth value={form.contactoEmail} onChange={onChange} /></Grid>
          <Grid item xs={12} md={4}><TextField name="contactoFono" label="Contacto - Fono" fullWidth value={form.contactoFono} onChange={onChange} /></Grid>
          <Grid item xs={12} md={4}><TextField name="cuposMax" label="Cupos Máx." type="number" fullWidth value={form.cuposMax} onChange={onChange} /></Grid>
          <Grid item xs={12} md={4}><TextField name="suscripcionInicio" label="Inicio Suscripción" type="date" fullWidth value={form.suscripcionInicio} onChange={onChange} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item xs={12} md={4}><TextField name="suscripcionDias" label="Días Suscripción" type="number" fullWidth value={form.suscripcionDias} onChange={onChange} /></Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Admin de Flota (ADMIN_EDT)</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}><TextField name="adminRut" label="RUT Admin" fullWidth value={form.adminRut} onChange={onChange} /></Grid>
          <Grid item xs={12} md={4}><TextField name="adminPin" label="PIN (6 dígitos)" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} fullWidth value={form.adminPin} onChange={onChange} /></Grid>
          <Grid item xs={12} md={4}><TextField name="adminEmail" label="Email Admin" type="email" fullWidth value={form.adminEmail} onChange={onChange} /></Grid>
          <Grid item xs={12} md={6}><TextField name="adminNombre" label="Nombre Admin" fullWidth value={form.adminNombre} onChange={onChange} /></Grid>
          <Grid item xs={12} md={6}><TextField name="adminApellido" label="Apellido Admin" fullWidth value={form.adminApellido} onChange={onChange} /></Grid>
          <Grid item xs={12} md={6}><TextField name="adminFono" label="Fono Admin" fullWidth value={form.adminFono} onChange={onChange} /></Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" disabled={loading} onClick={submit}>
            {loading ? 'Creando...' : 'Crear Empresa'}
          </Button>
          <Button variant="outlined" href="/superadmin/empresas">Ver listado</Button>
        </Box>
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
