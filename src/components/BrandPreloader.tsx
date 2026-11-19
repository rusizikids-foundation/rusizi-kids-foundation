import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';

export const BrandPreloader: React.FC = () => {
  const { settings } = useData();
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'done'>('loading');

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const loadDuration = prefersReducedMotion ? 500 : 2000;
    const exitDuration = prefersReducedMotion ? 200 : 600;

    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, loadDuration);

    const doneTimer = setTimeout(() => {
      setPhase('done');
    }, loadDuration + exitDuration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'done') {
    return null;
  }

  const logoSrc =
    settings.primaryLogo || '/assets/aistudio/RUSIZI_FOUNDATION_afe2877a.png';
  const foundationTitle = (
    settings.foundationName || 'Rusizi Kids Foundation'
  ).toUpperCase();
  const rawSlogan = (settings.slogan || 'FROM RUSIZI TO THE WORLD').replace(
    /\.+$/,
    ''
  );

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Rusizi Kids Foundation"
      className={`fixed inset-0 z-[100] bg-[#120B08] flex flex-col items-center justify-center px-6 select-none transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        phase === 'exiting'
          ? 'opacity-0 -translate-y-8 pointer-events-none'
          : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Subtle Ambient Dark-Chocolate & Gold Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(217, 166, 46, 0.12) 0%, rgba(29, 18, 13, 0.45) 38%, rgba(18, 11, 8, 1) 72%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Animated Circular Gold Logo Emblem with Soft Halo & Rotating Ring */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center animate-preloader-logo">
          {/* Soft Golden Halo / Pulse Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[#D9A62E]/20 blur-xl animate-preloader-halo"
          />

          {/* Thin Rotating Metallic Gold Ring */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-[#D9A62E]/25 border-t-[#F2C14E] border-r-[#D9A62E]/75 animate-preloader-ring shadow-[0_0_24px_rgba(217,166,46,0.28)]"
          />

          {/* Secondary Counter-Rotating Inner Hairline Ring */}
          <div
            aria-hidden="true"
            className="absolute inset-2 rounded-full border border-[#D9A62E]/15 border-b-[#F2C14E]/60 animate-preloader-ring-reverse"
          />

          {/* Circular Gold RKF Logo Frame (Connected to Admin CMS) */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#1D120D] border-2 border-[#D9A62E] shadow-[0_0_30px_rgba(217,166,46,0.32)] p-1 flex items-center justify-center">
            <img
              src={logoSrc}
              alt="Rusizi Kids Foundation Logo"
              className="w-full h-full object-contain rounded-full"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.fallbackApplied) {
                  img.dataset.fallbackApplied = '1';
                  img.src = '/assets/aistudio/RUSIZI_FOUNDATION_afe2877a.png';
                }
              }}
            />
          </div>
        </div>

        {/* Foundation Name & Slogan */}
        <div className="mt-7 space-y-2 animate-preloader-text">
          <h2 className="font-display text-lg sm:text-2xl font-bold tracking-[0.22em] text-[#F2C14E]">
            {foundationTitle}
          </h2>
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#D6C7B8]">
            {rawSlogan}
          </p>
        </div>

        {/* Sleek Thin Golden Progress Bar (0% -> 100% over 2s) */}
        <div className="mt-7 w-56 sm:w-64">
          <div className="h-[2.5px] w-full bg-[#281912] rounded-full overflow-hidden border border-[#D9A62E]/20">
            <div className="h-full bg-gradient-to-r from-[#B8861B] via-[#F2C14E] to-[#D9A62E] rounded-full animate-preloader-progress shadow-[0_0_12px_rgba(242,193,78,0.65)]" />
          </div>
        </div>
      </div>
    </div>
  );
};
