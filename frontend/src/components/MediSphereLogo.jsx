import React from 'react';

export default function MediSphereLogo({ className = "w-8 h-8", withGlow = true }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {withGlow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl blur-[6px] opacity-40 -z-10 transform scale-105 pointer-events-none" />
      )}
      <svg 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="medisphere-bg" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="medisphere-sheen" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Modern Rounded Container Badge */}
        <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#medisphere-bg)" />
        <rect x="3.5" y="3.5" width="41" height="41" rx="12.5" stroke="url(#medisphere-sheen)" strokeWidth="1" />

        {/* 3D Sphere Orbital Rings */}
        <circle cx="24" cy="24" r="16" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.22" fill="none" />
        <ellipse cx="24" cy="24" rx="16.5" ry="7" stroke="#ffffff" strokeWidth="1.3" strokeOpacity="0.45" fill="none" transform="rotate(-25 24 24)" />

        {/* Medical Cross Vertical Pillars */}
        <rect x="21" y="9.5" width="6" height="7.5" rx="3" fill="#ffffff" />
        <rect x="21" y="31" width="6" height="7.5" rx="3" fill="#ffffff" />

        {/* Heartbeat ECG Pulse Wave - Medical Horizontal Bar */}
        <path 
          d="M8.5 24h9.5l2-5 3.5 10 3-7 1.5 2H39.5" 
          stroke="#ffffff" 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Core Vital Sparkle Point */}
        <circle cx="23.5" cy="29" r="1.5" fill="#38bdf8" />
      </svg>
    </div>
  );
}
