'use client';
import * as React from 'react';

export default function TractorTruckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={28} height={28} viewBox="0 0 64 64" fill="none" {...props}>
      <path d="M10 42h38a6 6 0 0 0 6-6v-2H42l-6-8h-8l-4-6H10v22Z" fill="#0E2244"/>
      <path d="M6 42h4V20H6a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2Z" fill="#0E2244"/>
      <circle cx="18" cy="48" r="6" fill="#0E2244"/>
      <circle cx="46" cy="48" r="6" fill="#0E2244"/>
      <rect x="28" y="24" width="10" height="6" rx="1.5" fill="#CE9B25"/>
      <path d="M42 34h12" stroke="#0E2244" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}
