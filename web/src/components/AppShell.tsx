'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, Divider, IconButton, useMediaQuery, Chip, Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentsIcon from '@mui/icons-material/Payments';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SettingsIcon from '@mui/icons-material/Settings';

// Logos
import LogoDark from '../app/images/01-ImagotipoPrincipal.svg'; // para fondos oscuros
import Watermark from '../app/images/03-Isotipo.svg';            // sello de agua

const NAVY = '#0E2244';
const GOLD = '#CE9B25';
const drawerWidth = 264;

const navItems = [
  { href: '/superadmin/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { href: '/superadmin/empresas', label: 'Empresas', icon: <BusinessIcon /> },
  { href: '/superadmin/admins', label: 'Admins de flota', icon: <PeopleIcon /> },
  { href: '/superadmin/conductores', label: 'Conductores', icon: <PeopleIcon /> },
  { href: '/superadmin/servicios', label: 'Servicios', icon: <AssignmentIcon /> },
  { href: '/superadmin/pagos', label: 'Pagos', icon: <PaymentsIcon /> },
  { href: '/superadmin/auditoria', label: 'Auditoría', icon: <FactCheckIcon /> },
  { href: '/superadmin/config', label: 'Configuración', icon: <SettingsIcon /> },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isMdUp = useMediaQuery('(min-width:900px)');
  const [open, setOpen] = React.useState(isMdUp);
  React.useEffect(() => setOpen(isMdUp), [isMdUp]);

  const saName = typeof window !== 'undefined' ? sessionStorage.getItem('sa_nombre') || 'SUPERADMIN' : 'SUPERADMIN';

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sa_token');
      sessionStorage.removeItem('sa_role');
      sessionStorage.removeItem('sa_nombre');
    }
    router.replace('/superadmin/login');
  };

  const DrawerContent = (
    <Box sx={{ height:'100%', display:'flex', flexDirection:'column', bgcolor: NAVY, color: '#FFF' }}>
      <Toolbar sx={{ gap: 1 }}>
        <Image src={LogoDark} alt="NapaviTruck" width={148} height={36} priority />
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,.15)' }} />
      <List sx={{ py: 1 }}>
        {navItems.map(({ href, label, icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <ListItemButton
              component={Link}
              href={href}
              key={href}
              selected={!!active}
              sx={{
                borderRadius: 1.5,
                mx: 1,
                color: '#FFF',
                '& .MuiListItemIcon-root': { color: '#FFF' },
                '&.Mui-selected': { bgcolor: 'rgba(255,255,255,.12)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ borderColor: 'rgba(255,255,255,.15)' }} />
      <Box sx={{ p: 2 }}>
        <Chip
          label={`Sesión: ${saName}`}
          sx={{
            width: '100%',
            bgcolor: 'rgba(206,155,37,0.18)',
            color: '#FFF',
            borderColor: GOLD,
            fontWeight: 700,
          }}
          variant="outlined"
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: '#F6F8FB' }}>
      {/* AppBar navy */}
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: NAVY, color: '#FFF', zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton onClick={() => setOpen(!open)} aria-label="Abrir menú" size="small" sx={{ color:'#FFF' }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
            <Image src={LogoDark} alt="NapaviTruck" width={120} height={28} priority />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Consola — Superadmin</Typography>
          </Box>
          <Box sx={{ flexGrow:1 }} />
          <Button onClick={handleLogout} variant="outlined" sx={{ color:'#FFF', borderColor:'rgba(255,255,255,.5)' }}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer navy */}
      <Drawer
        variant={isMdUp ? 'persistent' : 'temporary'}
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 0,
            bgcolor: NAVY,
          },
        }}
      >
        {DrawerContent}
      </Drawer>

      {/* Main con watermark */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, position: 'relative', minHeight: 'calc(100dvh - 64px)' }}>
          {/* Watermark */}
          <Box
            aria-hidden
            sx={{
              position:'absolute', inset: 0, pointerEvents:'none',
              backgroundImage: `url(${(Watermark as any).src})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: { xs: '60%', md: '40%' },
              opacity: 0.035,
              filter: 'grayscale(100%)',
            }}
          />
          <Box sx={{ position:'relative' }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
