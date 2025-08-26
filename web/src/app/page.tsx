'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AppBar, Toolbar, Container, Box, Typography, Button, IconButton, Paper, Grid, Chip, Stack,
  Accordion, AccordionSummary, AccordionDetails, Divider, useScrollTrigger, Slide, Card, CardContent, CardActions
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';

// ====== ASSETS ======
import heroImg from './images/landingpage.jpg';
import logoWhite from './images/01-ImagotipoPrincipal.svg';
import appIcon from './images/logoapp.png';
import logoBlack from './images/PNG imagotipos-11.png';

// ====== THEME PRIMARIOS (ya están en tu MUI theme) ======
const NAVY = '#0E2244';
const GOLD = '#CE9B25';

// ====== UTILS ======
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

// Precios desde variables de entorno (puedes poner CLP o UF; mostramos el símbolo que definas)
const PRICE_30  = process.env.NEXT_PUBLIC_PRICE_30  || '';  // ej "CLP 39.900"
const PRICE_90  = process.env.NEXT_PUBLIC_PRICE_90  || '';
const PRICE_180 = process.env.NEXT_PUBLIC_PRICE_180 || '';
const PRICE_360 = process.env.NEXT_PUBLIC_PRICE_360 || '';

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// ====== NAVBAR ======
function Navbar() {
  const [openMenu, setOpenMenu] = React.useState(false);
  return (
    <>
      <HideOnScroll>
        <AppBar elevation={0} sx={{ bgcolor: 'rgba(14,34,68,0.9)', backdropFilter: 'saturate(180%) blur(6px)' }}>
          <Toolbar sx={{ minHeight: 72 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Image src={logoWhite} alt="NapaviTruck" priority height={28} />
            </Box>
            <Box sx={{ flex: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button color="inherit" component="a" href="#producto">Producto</Button>
              <Button color="inherit" component="a" href="#beneficios">Beneficios</Button>
              <Button color="inherit" component="a" href="#precios">Precios</Button>
              <Button color="inherit" component="a" href="#faq">FAQ</Button>
              <Button
                variant="contained"
                sx={{ bgcolor: GOLD, color: '#0B0B0B', '&:hover': { bgcolor: '#B7841F' } }}
                component={Link}
                href="/login"
              >
                Ingresar
              </Button>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton color="inherit" onClick={() => setOpenMenu(s => !s)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      {/* Menú móvil simple */}
      {openMenu && (
        <Paper square sx={{ position: 'fixed', top: 72, left: 0, right: 0, bgcolor: NAVY, zIndex: 5 }}>
          <Container sx={{ py: 2 }}>
            <Stack spacing={1}>
              <Button color="inherit" component="a" href="#producto" onClick={() => setOpenMenu(false)}>Producto</Button>
              <Button color="inherit" component="a" href="#beneficios" onClick={() => setOpenMenu(false)}>Beneficios</Button>
              <Button color="inherit" component="a" href="#precios" onClick={() => setOpenMenu(false)}>Precios</Button>
              <Button color="inherit" component="a" href="#faq" onClick={() => setOpenMenu(false)}>FAQ</Button>
              <Button
                variant="contained"
                sx={{ bgcolor: GOLD, color: '#0B0B0B', '&:hover': { bgcolor: '#B7841F' } }}
                component={Link}
                href="/login"
                onClick={() => setOpenMenu(false)}
              >
                Ingresar
              </Button>
            </Stack>
          </Container>
        </Paper>
      )}
      <Toolbar sx={{ minHeight: 72 }} /> {/* offset */}
    </>
  );
}

// ====== HERO ======
function Hero() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: { xs: 520, md: 640 },
        display: 'grid',
        alignItems: 'center',
        bgcolor: NAVY,
        color: 'white',
        overflow: 'hidden',
      }}
    >
      <Image
        src={heroImg}
        alt="Logística y transporte"
        fill
        priority
        style={{ objectFit: 'cover', opacity: 0.35 }}
        sizes="100vw"
      />
      <Container sx={{ position: 'relative' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Chip label="Plataforma TMS • Chile" sx={{ bgcolor: 'rgba(206,155,37,.15)', color: GOLD, mb: 2 }} />
            <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Control total de tu flota y servicios, en tiempo real
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, opacity: 0.9 }}>
              Crea empresas y administradores, da de alta conductores, gestiona suscripciones,
              y comparte el progreso con tus clientes de forma segura.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
              <Button
                component="a"
                href="mailto:contacto@napavitruck.cl?subject=Solicitud%20de%20acceso%20NapaviTruck"
                size="large"
                variant="contained"
                sx={{ bgcolor: GOLD, color: '#0B0B0B', '&:hover': { bgcolor: '#B7841F' } }}
              >
                Contactar accesos
              </Button>
              <Button component="a" href="#precios" size="large" variant="outlined" sx={{ borderColor: 'white', color: 'white' }}>
                Ver precios
              </Button>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 4 }} alignItems="center">
              <Image src={appIcon} alt="App" width={36} height={36} />
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Soporte web y app móvil para conductores.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ====== STRIP DE LOGOS (si no hay clientes aún, usamos marca propia y “powered by”) ======
function LogosStrip() {
  return (
    <Box component="section" sx={{ py: 4, bgcolor: '#0F1B33' }}>
      <Container>
        <Stack direction="row" spacing={4} alignItems="center" justifyContent="center" sx={{ flexWrap: 'wrap', rowGap: 2 }}>
          <Image src={logoBlack} alt="NapaviTruck" height={28} />
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,.12)' }} />
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.7)' }}>
            Infraestructura en AWS • Seguridad con JWT y guards por rol
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

// ====== BENEFICIOS ======
function Benefits() {
  const items = [
    { title: 'Gobierno total', desc: 'Crea empresas, administradores de flota y gestiona suscripciones y cupos.' },
    { title: 'Alta ágil de conductores', desc: 'Carga individual o masiva (CSV), con PIN seguro de ingreso.' },
    { title: 'Roles y permisos', desc: 'SUPERADMIN, ADMIN_EDT, conductor dependiente e independiente.' },
    { title: 'Auditoría y estados', desc: 'Historial de eventos, suspensión y reactivación con motivos.' },
    { title: 'Compartir con clientes', desc: 'Invitaciones seguras, solo-lectura, para seguimiento de servicios.' },
    { title: 'Exportables', desc: 'Credenciales CSV/PDF y reportes de uso.' },
  ];
  return (
    <Box id="beneficios" component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#0E2244' }}>
      <Container>
        <Typography variant="h3" sx={{ color: 'white', textAlign: 'center', fontWeight: 800, mb: 1 }}>
          Beneficios clave
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,.75)', textAlign: 'center', mb: 5 }}>
          Todo lo que necesitas para operar tu flota con control y transparencia.
        </Typography>

        <Grid container spacing={2}>
          {items.map((b) => (
            <Grid key={b.title} item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: 3,
                }}
                elevation={0}
              >
                <Typography variant="h6" sx={{ color: GOLD, fontWeight: 700, mb: 1 }}>{b.title}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.85)' }}>{b.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ====== PRODUCTO (capturas / highlights) ======
function ProductSection() {
  return (
    <Box id="producto" component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#0F1B33' }}>
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>
              El panel que concentra tu operación
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,.75)' }}>
              Dashboard con KPIs, barra lateral fija con accesos, y flujos por rol.
              Controla empresas, cupos, conductores y servicios en segundos.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap', rowGap: 1 }}>
              {['KPIs en tiempo real', 'Carga CSV', 'Exportables', 'Suscripciones', 'Guard roles JWT'].map(t => (
                <Chip key={t} label={t} size="small" sx={{ bgcolor: 'rgba(206,155,37,.15)', color: GOLD }} />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,.12)' }}>
              {/* Aquí idealmente muestras un mock del dashboard; por ahora usamos el hero como placeholder recortado */}
              <Image src={heroImg} alt="Dashboard NapaviTruck" style={{ objectFit: 'cover' }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ====== CÓMO FUNCIONA ======
function HowItWorks() {
  const steps = [
    { n: 1, t: 'Crea tu empresa y administrador', d: 'Desde la consola de SUPERADMIN, deja la estructura lista.' },
    { n: 2, t: 'Da de alta conductores', d: 'Carga individual o CSV; asigna PIN y cupos.' },
    { n: 3, t: 'Opera y comparte', d: 'Gestiona servicios y comparte acceso de solo lectura con tus clientes.' },
  ];
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#0E2244' }}>
      <Container>
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 5, textAlign: 'center' }}>
          ¿Cómo funciona?
        </Typography>
        <Grid container spacing={3}>
          {steps.map(s => (
            <Grid key={s.n} item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', bgcolor: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 3 }} elevation={0}>
                <Typography variant="h2" sx={{ color: GOLD, fontWeight: 900, mb: 1 }}>{s.n}</Typography>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>{s.t}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.85)', mt: 1 }}>{s.d}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ====== KPIs ======
function KPIs() {
  const items = [
    { k: '98%', t: 'cumplimiento de hitos' },
    { k: '30%', t: 'menos tiempo ocioso' },
    { k: '24/7', t: 'visibilidad operativa' },
  ];
  return (
    <Box component="section" sx={{ py: 6, bgcolor: '#0F1B33' }}>
      <Container>
        <Grid container spacing={2} justifyContent="center">
          {items.map((x) => (
            <Grid key={x.k} item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'transparent' }}>
                <Typography variant="h3" sx={{ color: GOLD, fontWeight: 800 }}>{x.k}</Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,.75)' }}>{x.t}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ====== PRICING (lee variables de entorno) ======
function Pricing() {
  const plans = [
    { name: 'Plan 30 días',   price: PRICE_30,  badge: 'Rápido de partir',   features: ['Acceso completo', 'Soporte estándar', 'Renovable 30 días'] },
    { name: 'Plan 90 días',   price: PRICE_90,  badge: 'Más conveniente',    features: ['Todo el plan 30', 'Mejor costo/beneficio', 'Renovable 90 días'] },
    { name: 'Plan 180 días',  price: PRICE_180, badge: 'Escala operativa',   features: ['Prioridad soporte', 'Auditoría ampliada', 'Renovable 180 días'] },
    { name: 'Plan 360 días',  price: PRICE_360, badge: 'Empresas EDT',       features: ['Mejor tarifa anual', 'Acompañamiento', 'Renovable 360 días'] },
  ];

  return (
    <Box id="precios" component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#0E2244' }}>
      <Container>
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1, textAlign: 'center' }}>
          Precios transparentes
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,.75)', textAlign: 'center', mb: 5 }}>
          Elige la duración que mejor se adapte a tu operación. Renovación simple sin días de gracia.
        </Typography>

        <Grid container spacing={3}>
          {plans.map(p => (
            <Grid key={p.name} item xs={12} md={3}>
              <Card sx={{ height: '100%', borderRadius: 3, bgcolor: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }} elevation={0}>
                <CardContent>
                  <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>{p.name}</Typography>
                    <Chip size="small" label={p.badge} sx={{ bgcolor: 'rgba(206,155,37,.15)', color: GOLD }} />
                  </Stack>
                  <Typography variant="h4" sx={{ color: GOLD, fontWeight: 900, minHeight: 56 }}>
                    {p.price || '—'}
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    {p.features.map(f => (
                      <Typography key={f} variant="body2" sx={{ color: 'rgba(255,255,255,.85)' }}>• {f}</Typography>
                    ))}
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: GOLD, color: '#0B0B0B', '&:hover': { bgcolor: '#B7841F' } }}
                    href="mailto:contacto@napavitruck.cl?subject=Quiero%20empezar%20con%20NapaviTruck"
                  >
                    Hablar con accesos
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,.6)', mt: 2, textAlign: 'center' }}>
          ¿Tienes requisitos especiales o gran volumen? Escríbenos a <a href="mailto:contacto@napavitruck.cl" style={{ color: GOLD }}>contacto@napavitruck.cl</a>
        </Typography>
      </Container>
    </Box>
  );
}

// ====== TESTIMONIOS ======
function Testimonials() {
  const ts = [
    { q: 'Simplificó el alta de conductores y mejoró la trazabilidad de nuestros servicios.', a: 'Coord. Flota, Operador EDT' },
    { q: 'El acceso de clientes por invitación nos ahorró llamadas y correos.', a: 'Jefe de Operaciones, Transporte' },
    { q: 'Renovar suscripciones y cupos es rápido y transparente.', a: 'Administrador, Logística' },
  ];
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#0F1B33' }}>
      <Container>
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 5, textAlign: 'center' }}>
          Lo que dicen nuestros usuarios
        </Typography>
        <Grid container spacing={3}>
          {ts.map(t => (
            <Grid key={t.q} item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid rgba(255,255,255,.1)', bgcolor: 'rgba(255,255,255,.03)' }}>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,.9)' }}>&ldquo;{t.q}&rdquo;</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'rgba(255,255,255,.6)' }}>{t.a}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ====== FAQ ======
function FAQ() {
  const qa = [
    { q: '¿Cómo obtengo acceso?', a: 'Escríbenos a contacto@napavitruck.cl o llámanos al +56 9 6822 0532. Te habilitamos de inmediato.' },
    { q: '¿Puedo invitar a mis clientes?', a: 'Sí. Desde el panel, compartes un enlace seguro de solo lectura para cada servicio.' },
    { q: '¿Administran conductores independientes?', a: 'Sí. Pueden registrarse y operar con empresa individual y cupo asignado.' },
    { q: '¿Dónde se aloja la plataforma?', a: 'En AWS, con contenedores y buenas prácticas de seguridad (JWT, guards de rol, auditoría).' },
  ];
  return (
    <Box id="faq" component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#0E2244' }}>
      <Container>
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 3, textAlign: 'center' }}>
          Preguntas frecuentes
        </Typography>
        {qa.map(item => (
          <Accordion key={item.q} sx={{ bgcolor: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', color: 'white', mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon htmlColor="#fff" />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.85)' }}>{item.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}

// ====== CTA FINAL ======
function FinalCTA() {
  return (
    <Box component="section" sx={{ py: 8, bgcolor: '#0F1B33' }}>
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 800 }}>
          Listo para profesionalizar tu operación logística
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,.75)', mt: 1 }}>
          Escríbenos a <a href="mailto:contacto@napavitruck.cl" style={{ color: GOLD }}>contacto@napavitruck.cl</a> o llámanos al <a href="tel:+56968220532" style={{ color: GOLD }}>+56 9 6822 0532</a>
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            sx={{ bgcolor: GOLD, color: '#0B0B0B', '&:hover': { bgcolor: '#B7841F' } }}
            href="mailto:contacto@napavitruck.cl?subject=Quiero%20empezar%20con%20NapaviTruck"
          >
            Contactar accesos
          </Button>
          <Button variant="outlined" component={Link} href="/login" sx={{ color: 'white', borderColor: 'white' }}>
            Ingresar
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

// ====== FOOTER ======
function Footer() {
  return (
    <Box component="footer" sx={{ py: 4, bgcolor: NAVY }}>
      <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Image src={logoWhite} alt="NapaviTruck" height={22} />
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,.16)', mx: 1 }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.7)' }}>
            © {new Date().getFullYear()} NapaviTruck. Todos los derechos reservados.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button href="#precios" color="inherit" size="small">Precios</Button>
          <Button href="#faq" color="inherit" size="small">FAQ</Button>
          <Button href="mailto:contacto@napavitruck.cl" color="inherit" size="small">Contacto</Button>
        </Stack>
      </Container>
    </Box>
  );
}

// ====== PAGE ======
export default function Landing() {
  return (
    <Box sx={{ bgcolor: '#0B1326' }}>
      <Navbar />
      <Hero />
      <LogosStrip />
      <Benefits />
      <ProductSection />
      <HowItWorks />
      <KPIs />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </Box>
  );
}
