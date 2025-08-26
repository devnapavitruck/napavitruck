'use client';
import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const t = sessionStorage.getItem('sa_token');
    const r = sessionStorage.getItem('sa_role');
    if (!t || r !== 'SUPERADMIN') {
      const next = encodeURIComponent(pathname || '/superadmin/dashboard');
      router.replace(`/superadmin/login?next=${next}`);
    }
  }, [router, pathname]);

  return <>{children}</>;
}
