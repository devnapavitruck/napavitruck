'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Box, Grid, Paper, Typography, Stack, Chip, Divider, Button, Fade,
} from '@mui/material';
import AppShell from '../../../../components/AppShell';

const NAVY = '#0E2244';
const GOLD = '#CE9B25';

export default function SuperadminDashboardPage() {
  const KPIS = [
    { label: 'Empresas activas', value: '0' },
    { label: 'Conductores activos', value: '0' },
    { label: 'Servicios hoy', value: '0' },
    { label: 'Facturación mes', value: '$ 0' },
  ];

  return (
    <AppShell>
      <Fade in timeout={250}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: NAVY }}>
            Panel de control
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            {KPIS.map(k => (
              <Grid key={k.label} item xs={12} sm={6} md={3}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2, borderRadius: 2,
                    transition: 'transform 160ms ease',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <Typography sx={{ color: '#6B7280', mb: .5 }}>{k.label}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: NAVY }}>{k.value}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography sx={{ fontWeight: 900, color: NAVY }}>Suscripciones por vencer</Typography>
                  <Chip label="0" size="small" sx={{ bgcolor:'rgba(206,155,37,0.16)', color:NAVY, borderColor:GOLD }} variant="outlined" />
                </Stack>
                <Typography variant="body2" sx={{ color:'#4C5564' }}>
                  Empresas con vencimiento en 7 / 15 / 30 días.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Button size="small" component={Link} href="/superadmin/empresas" variant="contained" sx={{ bgcolor:NAVY, '&:hover':{ bgcolor:'#0B1C37' } }}>
                  Ver detalle
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography sx={{ fontWeight: 900, color: NAVY }}>Actividad reciente</Typography>
                  <Chip label="Auditoría" size="small" sx={{ bgcolor:'rgba(206,155,37,0.16)', color:NAVY, borderColor:GOLD }} variant="outlined" />
                </Stack>
                <Typography variant="body2" sx={{ color:'#4C5564' }}>
                  Últimos eventos del sistema.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Button size="small" component={Link} href="/superadmin/auditoria" variant="outlined" sx={{ borderColor:NAVY, color:NAVY }}>
                  Ver auditoría
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </AppShell>
  );
}
