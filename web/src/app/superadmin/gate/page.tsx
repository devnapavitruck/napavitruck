'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box, Paper, Typography, Stack, TextField, Button, Alert, Fade,
} from '@mui/material';
import { unlockSuperadmin } from './actions';

// Assets de marca
import Logo from '../../images/01-ImagotipoPrincipal.svg';
import Hero from '../../images/landingpage.jpg';

const NAVY = '#0E2244';

export default function SuperadminGatePage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/superadmin/dashboard';

  const [pass, setPass] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErr(null);
    setLoading(true);
    const ok = await unlockSuperadmin(pass);
    setLoading(false);
    if (!ok.ok) { setErr('Clave maestra inválida.'); return; }
    router.replace(next);
  };

  return (
    <Box sx={{ minHeight:'100dvh', display:'grid', gridTemplateColumns:{ xs:'1fr', md:'1.15fr 0.85fr' } }}>
      {/* Columna izquierda: formulario */}
      <Box sx={{ p:{ xs:3, md:6 }, display:'flex', alignItems:'center', bgcolor:'#F6F8FB' }}>
        <Fade in timeout={300}>
          <Box component="form" onSubmit={onSubmit} sx={{ width:'100%', maxWidth: 540, mx:'auto' }}>
            <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:3 }}>
              <Image src={Logo} alt="NapaviTruck" width={140} height={40} priority />
            </Box>

            <Paper elevation={0} sx={{ p:{ xs:2.5, md:3 }, border:'1px solid #E6E9EE', borderRadius:3, bgcolor:'#FFF' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb:0.5, color:NAVY }}>
                Acceso SUPERADMIN
              </Typography>
              <Typography variant="body2" sx={{ color:'#4C5564', mb:2 }}>
                Ingresa tu <b>clave maestra</b> para abrir la consola.
              </Typography>

              <Stack spacing={1.5}>
                <TextField
                  label="Clave maestra"
                  type="password"
                  value={pass}
                  onChange={(e)=>setPass(e.target.value)}
                  autoFocus
                  inputProps={{ 'aria-label':'Clave maestra SUPERADMIN' }}
                />
                {err && <Alert severity="error" role="alert">{err}</Alert>}
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    bgcolor: NAVY,
                    '&:hover': { bgcolor: '#0B1C37' },
                    height: 44, borderRadius: 2,
                  }}
                >
                  {loading ? 'Validando…' : 'Desbloquear'}
                </Button>
                <Typography variant="caption" sx={{ color:'#6B7280' }}>
                  Consejo: rota esta clave de forma periódica y compártela solo por canal seguro.
                </Typography>
              </Stack>
            </Paper>

            <Typography variant="caption" sx={{ display:'block', mt:2, color:'#6B7280' }}>
              © {new Date().getFullYear()} NapaviTruck. Acceso exclusivo para el único SUPERADMIN.
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* Columna derecha: hero */}
      <Box sx={{ position:'relative', display:{ xs:'none', md:'block' } }}>
        <Image
          src={Hero}
          alt="Logística NapaviTruck"
          fill
          style={{ objectFit:'cover' }}
          priority
        />
        <Box sx={{
          position:'absolute', inset:0,
          background:'linear-gradient(120deg, rgba(14,34,68,.7), rgba(14,34,68,.25))',
        }} />
        <Box sx={{ position:'absolute', bottom:24, left:24, right:24, color:'#FFF' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb:.5 }}>Control total</Typography>
          <Typography variant="body2" sx={{ opacity:.9 }}>
            Gestiona empresas, usuarios, pagos y auditoría desde un único panel.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
