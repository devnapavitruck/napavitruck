'use server';

import { cookies } from 'next/headers';

export async function unlockSuperadmin(pass: string) {
  const secret = process.env.SUPERADMIN_GATE_SECRET || '';
  if (!secret || pass !== secret) return { ok: false };

  const isProd = process.env.NODE_ENV === 'production';

  cookies().set('npv_sa_gate', secret, {
    httpOnly: true,
    secure: isProd,      // en localhost (http) debe quedar false
    sameSite: 'lax',
    maxAge: 60 * 60 * 12, // 12h
    path: '/',
  });

  return { ok: true };
}
