'use client';

import * as React from 'react';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Divider, Grid, Paper, Stack, Button, Chip,
  Table, TableHead, TableBody, TableRow, TableCell, Tooltip, TextField, InputAdornment,
} from '@mui/material';
import { alpha, useTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// === IMPORTA NUESTRO TEMA DIRECTO (ruta relativa) ===
import { theme as appTheme } from '../../theme/theme';

import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import GetAppIcon from '@mui/icons-material/GetApp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const drawerWidth = 260;

export default function SuperadminDemo() {
  // ⚠️ Envolvemos SOLO esta página con el tema para ver los colores ya mismo
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <DemoContent />
    </ThemeProvider>
  );
}

function DemoContent() {
  const theme = useTheme();

  const softSecondaryBg = alpha(theme.palette.secondary.main, 0.14);
  const softSecondaryBgHover = alpha(theme.palette.secondary.main, 0.20);
  const softSuccessBg = alpha(theme.palette.success.main, 0.16);
  const softErrorBg = alpha(theme.palette.error.main, 0.14);
  const softInfoBg = alpha(theme.palette.info.main, 0.10);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* AppBar con PRIMARY de nuestro tema NAVY */}
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
            NapaviTruck — SUPERADMIN
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Cerrar sesión">
            <IconButton color="inherit">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Sidebar navy profundo */}
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: {
            width: drawerWidth,
            bgcolor: '#0B1B39',
            color: '#E8EEF6',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          },
        }}
        sx={{ width: drawerWidth, flexShrink: 0 }}
      >
        <Toolbar />
        <Box sx={{ overflowY: 'auto', height: '100%' }}>
          <List sx={{ px: 1 }}>
            <ListItemButton selected sx={navItemSx()}>
              <ListItemIcon sx={navIconSx()}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton sx={navItemSx()}>
              <ListItemIcon sx={navIconSx()}><BusinessIcon /></ListItemIcon>
              <ListItemText primary="Empresas" />
            </ListItemButton>
            <ListItemButton sx={navItemSx()}>
              <ListItemIcon sx={navIconSx()}><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Conductores" />
            </ListItemButton>
            <ListItemButton sx={navItemSx()}>
              <ListItemIcon sx={navIconSx()}><ReceiptLongIcon /></ListItemIcon>
              <ListItemText primary="Suscripciones" />
            </ListItemButton>
            <Divider sx={{ my: 1, opacity: 0.2, borderColor: 'rgba(255,255,255,0.18)' }} />
            <ListItemButton sx={navItemSx()}>
              <ListItemIcon sx={navIconSx()}><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Ajustes" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Contenido */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {/* franja de prueba: debe verse NAVY */}
        <Box sx={{ height: 8, bgcolor: 'primary.main', borderRadius: 1, mb: 2 }} />

        {/* KPIs */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={kpiCardSx()}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={kpiBadgeSx(softInfoBg)} />
                <Box>
                  <Typography variant="overline" sx={{ opacity: 0.7 }}>Empresas activas</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>24</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={kpiCardSx()}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={kpiBadgeSx(softSecondaryBg)}>
                  <WarningAmberIcon fontSize="small" sx={{ color: theme.palette.secondary.main }} />
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ opacity: 0.7 }}>Por vencer (≤7 días)</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>5</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={kpiCardSx()}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={kpiBadgeSx(softErrorBg)} />
                <Box>
                  <Typography variant="overline" sx={{ opacity: 0.7 }}>Expiradas</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>3</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={kpiCardSx()}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={kpiBadgeSx(softSuccessBg)} />
                <Box>
                  <Typography variant="overline" sx={{ opacity: 0.7 }}>Conductores totales</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>186</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Barra de acciones / búsqueda */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Buscar empresa..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ opacity: 0.6 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" startIcon={<AddIcon />}>
                Crear Empresa + Admin
              </Button>
              <Button variant="soft" color="secondary" startIcon={<PeopleIcon />}>
                Cargar Conductores
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Tabla de empresas */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
            Empresas
          </Typography>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>RUT</TableCell>
                <TableCell>Razón social</TableCell>
                <TableCell align="center">Asientos</TableCell>
                <TableCell align="center">Vence</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { rut: '76.123.456-7', rs: 'Trans Andes Ltda.', asientos: '10/12', vence: '19-09-2025', estado: 'ACTIVA' },
                { rut: '76.987.654-3', rs: 'LogiSur S.A.', asientos: '8/8', vence: '23-08-2025', estado: 'POR VENCER' },
                { rut: '77.555.111-9', rs: 'Carga Norte SpA', asientos: '15/20', vence: '10-08-2025', estado: 'EXPIRADA' },
              ].map((e) => (
                <TableRow key={e.rut} hover>
                  <TableCell>{e.rut}</TableCell>
                  <TableCell>{e.rs}</TableCell>
                  <TableCell align="center">{e.asientos}</TableCell>
                  <TableCell align="center">{e.vence}</TableCell>
                  <TableCell align="center">
                    {e.estado === 'ACTIVA'   && <Chip variant="soft" color="success"  label="ACTIVA"   size="small" />}
                    {e.estado === 'POR VENCER' && <Chip variant="soft" color="warning" label="POR VENCER" size="small" />}
                    {e.estado === 'EXPIRADA' && <Chip variant="soft" color="error"    label="EXPIRADA" size="small" />}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Renovar">
                        <Button variant="outlined" size="small" startIcon={<AutorenewIcon />}>
                          Renovar
                        </Button>
                      </Tooltip>
                      <Tooltip title="Suspender">
                        <Button variant="outlined" size="small" color="warning" startIcon={<PauseCircleOutlineIcon />}>
                          Suspender
                        </Button>
                      </Tooltip>
                      <Tooltip title="Exportar credenciales (CSV/PDF)">
                        <Button variant="contained" size="small" color="primary" startIcon={<GetAppIcon />}>
                          Credenciales
                        </Button>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Box sx={{ height: 32 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Notas de diseño
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                — Navy como color de acción principal.<br />
                — Dorado “soft” para acentos/alertas no críticas.<br />
                — Inputs con foco visible, bordes suaves.<br />
                — Tablas compactas, chips de estado legibles.<br />
                — Sombras sutiles, bordes 12px.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.14) }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <WarningAmberIcon sx={{ color: theme.palette.secondary.main }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                  Recordatorio
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: theme.palette.secondary.main }}>
                Demo visual sin lógica. Si el estilo te calza, lo bajo al tema global y replicamos el patrón.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

function navItemSx() {
  return {
    borderRadius: 1.5,
    mx: 1,
    mb: 0.5,
    '&.Mui-selected': {
      bgcolor: 'rgba(255,255,255,0.08)',
      borderLeft: '3px solid',
      borderColor: 'secondary.main',
    },
    '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
  };
}
function navIconSx() { return { color: 'inherit', minWidth: 40, opacity: 0.9 }; }
function kpiCardSx() {
  return { p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(2,6,23,0.06), 0 8px 24px rgba(2,6,23,0.06)', bgcolor: 'background.paper' };
}
function kpiBadgeSx(bg?: string) { return { width: 40, height: 40, borderRadius: 2, bgcolor: bg || 'divider' }; }
