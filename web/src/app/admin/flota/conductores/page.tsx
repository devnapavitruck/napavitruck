'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Paper, Typography, Stack, Button, Chip } from '@mui/material';
import AppShell from '../../../../components/AppShell';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import InsightsIcon from '@mui/icons-material/Insights';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';

const NAVY = '#0E2244';
const GOLD = '#CE9B25';

export default function ConductoresGridPage() {
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = sessionStorage.getItem('npv_token');
      const r = sessionStorage.getItem('npv_role');
      if (!t) router.replace('/login');
      if (r && r !== 'ADMIN_EDT') router.replace('/superadmin/dashboard');
    }
  }, [router]);

  const nav = [
    { label: 'Resumen',     href: '/admin/dashboard',   icon: <DashboardIcon /> },
    { label: 'Calendario',  href: '#',                  icon: <CalendarMonthIcon /> },
    { label: 'Servicios',   href: '#',                  icon: <LocalShippingIcon /> },
    { label: 'Mi Flota',    href: '/admin/flota',       icon: <Inventory2Icon />, active: true },
    { label: 'Documentos',  href: '#',                  icon: <DescriptionIcon /> },
    { label: 'Clientes',    href: '#',                  icon: <PeopleAltIcon /> },
    { label: 'Métricas',    href: '#',                  icon: <InsightsIcon /> },
    { label: 'Exportación', href: '#',                  icon: <FileDownloadIcon /> },
    { label: 'Finanzas',    href: '#',                  icon: <AccountBalanceIcon /> },
    { label: 'Ajustes',     href: '#',                  icon: <SettingsIcon /> },
  ];

  const columns: GridColDef[] = [
    { field: 'rut', headerName: 'RUT', flex: 1, minWidth: 140 },
    { field: 'nombre', headerName: 'Nombre', flex: 1.2, minWidth: 160 },
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 200 },
    {
      field: 'estado', headerName: 'Estado', width: 140,
      renderCell: (p) => <Chip size="small" label={p.value} color={p.value === 'Activo' ? 'success' : 'warning'} />,
      sortable: true,
    },
    { field: 'fechaAlta', headerName: 'Alta', width: 120 },
  ];

  // Demo data (reemplazar con fetch a la API /admin/conductores)
  const rows = [
    { id: '1', rut: '22.111.555-6', nombre: 'Pedro Araya', email: 'pedro@edt.cl', estado: 'Activo', fechaAlta: '2025-08-05' },
    { id: '2', rut: '21.333.444-2', nombre: 'María Soto', email: 'maria@edt.cl', estado: 'Suspendido', fechaAlta: '2025-07-30' },
    { id: '3', rut: '19.222.111-K', nombre: 'Luis Díaz', email: 'luis@edt.cl', estado: 'Activo', fechaAlta: '2025-07-15' },
  ];

  return (
    <AppShell title="ADMIN • Mi Flota / Conductores" nav={nav}>
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #E6E9EE', bgcolor: '#FFF' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: NAVY }}>Conductores</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => router.push('/admin/conductores')}>+ Agregar</Button>
            <Button variant="outlined">Carga CSV</Button>
            <Button variant="text">Exportar</Button>
          </Stack>
        </Stack>

        <Box sx={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            slots={{ toolbar: GridToolbar }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': { bgcolor: '#F5F7FA' },
            }}
          />
        </Box>
      </Paper>
    </AppShell>
  );
}
