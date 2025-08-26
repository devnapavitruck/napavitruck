import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'npv_sa_gate';
const GATE_PATH = '/superadmin/gate';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (!pathname.startsWith('/superadmin')) return NextResponse.next();
  if (pathname.startsWith(GATE_PATH)) return NextResponse.next(); // ← deja pasar el gate

  // Allowlist IP (opcional)
  const allowRaw = (process.env.SUPERADMIN_ALLOWED_IPS || '')
    .split(',').map(s => s.trim()).filter(Boolean);
  if (allowRaw.length) {
    let ip = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
    if (ip === '::1') ip = '127.0.0.1';
    if (ip && !allowRaw.includes(ip)) return new NextResponse('Forbidden', { status: 403 });
  }

  // Gate por cookie
  const secret = process.env.SUPERADMIN_GATE_SECRET || '';
  if (!secret) return new NextResponse('SUPERADMIN_GATE_SECRET missing', { status: 503 });
  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie !== secret) {
    const url = req.nextUrl.clone();
    url.pathname = GATE_PATH;
    const nextPath = pathname.startsWith(GATE_PATH) ? '/superadmin' : pathname;
    url.searchParams.set('next', nextPath + (searchParams.toString() ? `?${searchParams}` : ''));
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/superadmin/:path*'] };
