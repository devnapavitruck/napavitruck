'use client';
import * as React from 'react';

export default function SemiTrailerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={28} height={28} viewBox="0 0 80 64" fill="none" {...props}>
      {/* Tractor */}
      <path d="M10 40h18l6-8h10v8h8" fill="#0E2244"/>
      {/* Trailer (caja) */}
      <rect x="40" y="24" width="30" height="16" rx="2" fill="#0E2244"/>
      {/* Enganche */}
      <rect x="38" y="36" width="4" height="4" fill="#0E2244"/>
      {/* Ruedas */}
      <circle cx="22" cy="50" r="6" fill="#0E2244"/>
      <circle cx="50" cy="50" r="6" fill="#0E2244"/>
      <circle cx="66" cy="50" r="6" fill="#0E2244"/>
      {/* Detalle dorado */}
      <rect x="44" y="28" width="10" height="4" fill="#CE9B25"/>
    </svg>
  );
}
