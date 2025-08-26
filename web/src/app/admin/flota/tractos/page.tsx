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

export default function TractosGridPage() {
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
    { field: 'patente', headerName: 'Patente', width: 120 },
    { field: 'marca', headerName: 'Marca', flex: 1, minWidth: 120 },
    { field: 'modelo', headerName: 'Modelo', flex: 1, minWidth: 120 },
    { field: 'anio', headerName: 'Año', width: 100, type: 'number' },
    {
      field: 'estado', headerName: 'Estado', width: 140,
      renderCell: (p) => <Chip size="small" label={p.value} color={p.value === 'Operativo' ? 'success' : 'warning'} />,
    },
    { field: 'docVence', headerName: 'Doc. vence', width: 140 },
  ];

  const rows = [
    { id: 't1', patente: 'XY-12', marca: 'Volvo', modelo: 'FH', anio: 2021, estado: 'Operativo', docVence: '2025-09-20' },
    { id: 't2', patente: 'AB-34', marca: 'Scania', modelo: 'R450', anio: 2019, estado: 'Mantenimiento', docVence: '2025-10-12' },
  ];

  return (
    <AppShell title="ADMIN • Mi Flota / Tracto Camiones" nav={nav}>
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #E6E9EE', bgcolor: '#FFF' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: NAVY }}>Tracto Camiones</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined">+ Agregar</Button>
            <Button variant="outlined">Carga CSV</Button>
            <Button variant="text">Exportar</Button>
          </Stack>
        </Stack>

        <Box sx={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
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
