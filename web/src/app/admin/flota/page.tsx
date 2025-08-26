'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Grid, Paper, Typography, Button, Stack } from '@mui/material';
import AppShell from '../../../components/AppShell';

import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupWorkIcon from '@mui/icons-material/GroupWork'; // Mi Flota Externa

import TractorTruckIcon from '../../../components/icons/TractorTruckIcon';
import SemiTrailerIcon from '../../../components/icons/SemiTrailerIcon';

const NAVY = '#0E2244';

export default function MiFlotaHubPage() {
  const router = useRouter();

  // Guard: token y rol ADMIN_EDT
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = sessionStorage.getItem('npv_token');
      const r = sessionStorage.getItem('npv_role');
      if (!t) router.replace('/login');
      if (r && r !== 'ADMIN_EDT') router.replace('/superadmin/dashboard');
    }
  }, [router]);

  // Sidebar — agrega "Mi Flota Externa" (independientes/terceros)
  const nav = [
    { label: 'Resumen',           href: '/admin/dashboard',   icon: <DashboardIcon /> },
    { label: 'Calendario',        href: '#',                  icon: <CalendarMonthIcon /> },
    { label: 'Servicios',         href: '#',                  icon: <LocalShippingIcon /> },
    { label: 'Mi Flota',          href: '/admin/flota',       icon: <LocalShippingIcon />, active: true },
    { label: 'Mi Flota Externa',  href: '/admin/flota-externa', icon: <GroupWorkIcon /> },
    { label: 'Documentos',        href: '#',                  icon: <DescriptionIcon /> },
    { label: 'Clientes',          href: '#',                  icon: <PeopleAltIcon /> },
    { label: 'Métricas',          href: '#',                  icon: <InsightsIcon /> },
    { label: 'Exportación',       href: '#',                  icon: <FileDownloadIcon /> },
    { label: 'Finanzas',          href: '#',                  icon: <AccountBalanceIcon /> },
    { label: 'Ajustes',           href: '#',                  icon: <SettingsIcon /> },
  ];

  const CardLink = ({
    title, desc, icon, href,
  }: { title: string; desc: string; icon: React.ReactNode; href: string }) => (
    <Paper
      elevation={0}
      onClick={() => router.push(href)}
      sx={{
        p: 3, height: '100%', borderRadius: 3, border: '1px solid #E6E9EE', bgcolor: '#FFF',
        cursor: 'pointer', transition: 'all .2s ease',
        '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,.06)', borderColor: '#D9DFE8' },
      }}
    >
      <Stack spacing={1.5}>
        <Box sx={{ color: NAVY, fontSize: 0 }}>{icon}</Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: NAVY }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: '#4C5564' }}>{desc}</Typography>
        <Box sx={{ mt: 'auto' }}>
          <Button size="small" variant="text">Entrar</Button>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <AppShell title="ADMIN • Mi Flota" nav={nav}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: NAVY, mb: 2 }}>Mi Flota</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <CardLink
            title="Conductores"
            desc="Supervisión y gestión de conductores de la empresa."
            icon={<PeopleAltIcon fontSize="large" />}
            href="/admin/flota/conductores"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CardLink
            title="Tracto Camiones"
            desc="Gestión de unidades motrices (patentes y documentos)."
            icon={<TractorTruckIcon />}
            href="/admin/flota/tractos"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CardLink
            title="Semirremolques"
            desc="Gestión de unidades remolcadas (tipo, patentes y documentos)."
            icon={<SemiTrailerIcon />}
            href="/admin/flota/semirremolques"
          />
        </Grid>
      </Grid>
    </AppShell>
  );
}
