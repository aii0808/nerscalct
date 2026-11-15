import React from 'react';

/**
 * NersCalc Official Medical Healthcare Logo
 * Unsur Medis & Kesehatan: Palang Medis Klinis (Medical Cross) + Gelombang EKG Detak Jantung (Heart Pulse)
 */
export const NersLogo = ({ className = 'w-7 h-7', primaryColor = 'currentColor', pulseColor = '#FFFFFF' }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Medical Cross Body */}
      <rect x="18" y="6" width="12" height="36" rx="4" fill={primaryColor} />
      <rect x="6" y="18" width="36" height="12" rx="4" fill={primaryColor} />
      
      {/* Subtle Medical Contour */}
      <rect x="19" y="7" width="10" height="34" rx="3" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <rect x="7" y="19" width="34" height="10" rx="3" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      
      {/* Clinical Heartbeat Rhythm Line (ECG / P-Q-R-S-T) */}
      <path
        d="M7 24H16L19 18L23 31L27 14L31 28L34 24H41"
        stroke={pulseColor}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NersLogo;
