'use client';

import * as React from 'react';
import AppShell from '../../../../components/AppShell';
import { Box, Typography, Paper, Stack, TextField, Button, Grid } from '@mui/material';

const NAVY = '#0E2244';

export default function ConfigPage() {
  return (
    <AppShell>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 900, color: NAVY, mb: 2 }}>Configuración</Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>Planes y precios</Typography>
              <Stack spacing={1.5}>
                <TextField size="small" label="Plan 30 días (CLP)" />
                <TextField size="small" label="Plan 90 días (CLP)" />
                <TextField size="small" label="Plan 180 días (CLP)" />
                <TextField size="small" label="Plan 360 días (CLP)" />
                <Button variant="contained" sx={{ bgcolor:NAVY, '&:hover':{ bgcolor:'#0B1C37' } }}>Guardar</Button>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>Parámetros</Typography>
              <Stack spacing={1.5}>
                <TextField size="small" label="Días de gracia (0)" />
                <TextField size="small" label="Regla de cupos (nota)" />
                <TextField size="small" label="Plantilla exportación (identificador)" />
                <Button variant="outlined" sx={{ borderColor:NAVY, color:NAVY }}>Aplicar</Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AppShell>
  );
}
