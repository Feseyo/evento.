import React from 'react';

/**
 * Ambient Liquid Glass Background Orbs
 * Creates dynamic fluid color fields that float behind frosted glass surfaces,
 * providing the authentic refraction, color depth, and liquid distortion of high-end liquid glassmorphism.
 */
export const LiquidGlassBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none"
      aria-hidden="true"
    >
      {/* 1. Fluid Orb: Royal Indigo / Violet (Top Right) */}
      <div 
        className="absolute -top-[10%] -right-[5%] w-[480px] sm:w-[650px] h-[480px] sm:h-[650px] rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent dark:from-indigo-600/25 dark:via-purple-600/15 blur-3xl animate-liquid-blob-1 will-change-transform" 
      />

      {/* 2. Fluid Orb: Kerala Gold & Sunset Amber (Middle Left) */}
      <div 
        className="absolute top-[35%] -left-[10%] w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] rounded-full bg-gradient-to-tr from-amber-400/15 via-orange-400/10 to-transparent dark:from-amber-500/18 dark:via-orange-500/10 blur-3xl animate-liquid-blob-2 will-change-transform" 
      />

      {/* 3. Fluid Orb: Backwaters Emerald & Jade (Bottom Right) */}
      <div 
        className="absolute top-[65%] -right-[8%] w-[450px] sm:w-[620px] h-[450px] sm:h-[620px] rounded-full bg-gradient-to-bl from-emerald-400/12 via-teal-400/10 to-transparent dark:from-emerald-500/18 dark:via-teal-500/10 blur-3xl animate-liquid-blob-1 will-change-transform" 
      />

      {/* 4. Fluid Orb: Warm Rose / Coral (Bottom Center) */}
      <div 
        className="absolute -bottom-[15%] left-[25%] w-[400px] sm:w-[540px] h-[400px] sm:h-[540px] rounded-full bg-gradient-to-t from-rose-400/10 via-pink-400/5 to-transparent dark:from-rose-600/15 dark:via-purple-600/10 blur-3xl animate-liquid-blob-2 will-change-transform" 
      />

      {/* Subtle iridescent mesh noise texture layer (pure CSS gradient) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.06),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
    </div>
  );
};
