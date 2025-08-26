'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Grid, Paper, Typography, Button, Stack, Chip, Divider, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import AppShell from '../../../components/AppShell';

import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';
import AddTaskIcon from '@mui/icons-material/AddTask';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const NAVY = '#0E2244';
const GOLD = '#CE9B25';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Guard simple: exige token y rol ADMIN_EDT
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = sessionStorage.getItem('npv_token');
      const r = sessionStorage.getItem('npv_role');
      if (!t) router.replace('/login');
      if (r && r !== 'ADMIN_EDT') router.replace('/superadmin/dashboard');
    }
  }, [router]);

  // Sidebar del Admin: cambia "Conductores" -> "Mi Flota"
  const nav = [
    { label: 'Resumen',     href: '/admin/dashboard',   icon: <DashboardIcon />, active: true },
    { label: 'Calendario',  href: '#',                  icon: <CalendarMonthIcon /> },
    { label: 'Servicios',   href: '#',                  icon: <LocalShippingIcon /> },
    { label: 'Mi Flota',    href: '/admin/flota',       icon: <Inventory2Icon /> },
    { label: 'Documentos',  href: '#',                  icon: <DescriptionIcon /> },
    { label: 'Clientes',    href: '#',                  icon: <PeopleAltIcon /> },
    { label: 'Métricas',    href: '#',                  icon: <InsightsIcon /> },
    { label: 'Exportación', href: '#',                  icon: <FileDownloadIcon /> },
    { label: 'Finanzas',    href: '#',                  icon: <AccountBalanceIcon /> },
    { label: 'Ajustes',     href: '#',                  icon: <SettingsIcon /> },
  ];

  // Acciones rápidas: "Agregar conductor" ahora va a /admin/flota/conductores
  const QuickActions = () => (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      <Button variant="contained" startIcon={<AddTaskIcon />} sx={{ bgcolor: GOLD, color: '#0B0B0B', '&:hover': { bgcolor: '#B7841F' } }}>
        Crear servicio
      </Button>
      <Button variant="outlined" startIcon={<PersonAddAlt1Icon />} onClick={() => router.push('/admin/flota/conductores')}>
        Agregar conductor
      </Button>
      <Button variant="outlined" startIcon={<MailOutlineIcon />}>
        Invitar cliente
      </Button>
      <Button variant="outlined" startIcon={<CloudDownloadIcon />}>
        Exportar
      </Button>
    </Stack>
  );

  const KPICard = ({ label, value, chip }: { label: string; value: string; chip?: string }) => (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E6E9EE', bgcolor: '#FFF' }}>
      <Typography variant="body2" sx={{ color: '#5B6470' }}>{label}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 900, color: NAVY, mt: .5 }}>{value}</Typography>
      {chip && <Chip size="small" label={chip} sx={{ mt: 1, bgcolor: '#FFF3D6', color: GOLD, fontWeight: 600 }} />}
    </Paper>
  );

  const serviciosPorDia = [
    { d: 'Lun', total: 8 }, { d: 'Mar', total: 12 }, { d: 'Mié', total: 10 },
    { d: 'Jue', total: 14 }, { d: 'Vie', total: 9 }, { d: 'Sáb', total: 6 }, { d: 'Dom', total: 4 },
  ];
  const distEstados = [
    { name: 'Programados', value: 12 },
    { name: 'En curso', value: 7 },
    { name: 'Completados', value: 18 },
    { name: 'Incidencias', value: 2 },
  ];
  const PIE_COLORS = [NAVY, '#4B6AA5', GOLD, '#D97706'];

  return (
    <AppShell title="ADMIN • Resumen" nav={nav}>
      <Stack spacing={3}>
        <QuickActions />

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}><KPICard label="Servicios en curso" value="7" chip="+2 hoy" /></Grid>
          <Grid item xs={12} md={3}><KPICard label="Programados (24h)" value="12" /></Grid>
          <Grid item xs={12} md={3}><KPICard label="Conductores activos" value="23" /></Grid>
          <Grid item xs={12} md={3}><KPICard label="Docs por vencer (30d)" value="5" /></Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E6E9EE', bgcolor: '#FFF', height: 360 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: NAVY, mb: 1 }}>Servicios por día</Typography>
              <ResponsiveContainer width="100%" height={290}>
                <LineChart data={serviciosPorDia} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EE" />
                  <XAxis dataKey="d" stroke="#9AA3AF" />
                  <YAxis stroke="#9AA3AF" />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke={NAVY} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E6E9EE', bgcolor: '#FFF', height: 360 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: NAVY, mb: 1 }}>Distribución por estado</Typography>
              <ResponsiveContainer width="100%" height={290}>
                <PieChart>
                  <Pie data={distEstados} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                    {distEstados.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E6E9EE', bgcolor: '#FFF' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: NAVY }}>Documentos por vencer</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={1}>
                {[
                  { nombre: 'Licencia Pedro Araya', vence: '12/09/2025' },
                  { nombre: 'SOAP Camión XY-12', vence: '20/09/2025' },
                  { nombre: 'Permiso Camión AB-34', vence: '29/09/2025' },
                ].map(e => (
                  <Box key={e.nombre} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{e.nombre}</Typography>
                    <Chip size="small" label={e.vence} />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E6E9EE', bgcolor: '#FFF' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: NAVY }}>Actividad reciente</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={1}>
                {[
                  'Servicio SV-1021 asignado a María Soto',
                  'Conductor Luis Díaz reactivado',
                  'Cliente ACME invitado a SV-1019',
                  'Documento SOAP cargado (Camión XY-12)',
                ].map((t, i) => <Typography key={i} variant="body2">• {t}</Typography>)}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #E6E9EE', bgcolor: '#FFF' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: NAVY, p: 1.5, pb: 0 }}>Disponibles ahora</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Conductor</TableCell>
                    <TableCell>RUT</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { nombre: 'Pedro Araya', rut: '22.111.555-6', estado: 'Libre' },
                    { nombre: 'María Soto', rut: '21.333.444-2', estado: 'En ruta' },
                    { nombre: 'Luis Díaz',  rut: '19.222.111-K', estado: 'Libre' },
                  ].map(c => (
                    <TableRow key={c.rut} hover>
                      <TableCell>{c.nombre}</TableCell>
                      <TableCell>{c.rut}</TableCell>
                      <TableCell><Chip size="small" label={c.estado} color={c.estado === 'Libre' ? 'success' : 'default'} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </AppShell>
  );
}
