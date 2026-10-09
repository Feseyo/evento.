import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Sparkles, 
  ChevronRight, 
  Compass, 
  CalendarDays,
  Flame,
  Check
} from 'lucide-react';
import { CITIES } from '../data/mockEvents';
import { CityInfo } from '../types';

interface CityHeroBannerProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  onOpenCityModal: () => void;
  eventCount: number;
  culturalCount: number;
}

export const CityHeroBanner: React.FC<CityHeroBannerProps> = ({
  currentCity,
  onSelectCity,
  onOpenCityModal,
  eventCount,
  culturalCount,
}) => {
  const [imageError, setImageError] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const districtStripRef = useRef<HTMLDivElement | null>(null);

  // Parallax scroll tracking
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth mouse-wheel horizontal scrolling for district selector
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (districtStripRef.current && e.deltaY !== 0) {
      districtStripRef.current.scrollLeft += e.deltaY * 0.85;
    }
  };

  // Find active city details
  const activeCityInfo: CityInfo = CITIES.find(
    c => c.name.toLowerCase() === currentCity.toLowerCase()
  ) || CITIES[0];

  // Parallax transform calculation (bounded for performance and stability)
  const parallaxOffsetY = Math.min(scrollY * 0.22, 65);
  const parallaxScale = 1 + Math.min(scrollY * 0.00025, 0.04);

  return (
    <section id="hero-section" className="relative w-full overflow-hidden bg-white dark:bg-slate-950 pt-2 pb-6 sm:py-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO CITY CARD */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-slate-200/80 dark:border-slate-800/80 min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-6 sm:p-10 transition-all duration-500">
          
          {/* Background Scenic Landscape Image with Scroll Parallax */}
          {!imageError ? (
            <div 
              className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
              style={{
                transform: `translate3d(0, ${parallaxOffsetY}px, 0) scale(${parallaxScale})`,
                transition: 'transform 0.1s cubic-bezier(0, 0, 0.2, 1)',
              }}
            >
              <img 
                key={activeCityInfo.id}
                src={activeCityInfo.bannerImage} 
                alt={activeCityInfo.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950" />
          )}

          {/* Scrim Gradient Overlays for High Contrast & Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

          {/* Ambient Kerala Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Banner Content */}
          <div className="relative z-10 max-w-3xl space-y-3">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                <span className="text-sm">{activeCityInfo.flag}</span>
                <span>{activeCityInfo.malayalam}</span>
                <span className="text-amber-400/60">·</span>
                <span className="uppercase tracking-wider">{activeCityInfo.name}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
                <Compass className="w-3 h-3 text-indigo-400" />
                <span>{activeCityInfo.country}</span>
              </span>

              {culturalCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md">
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>{culturalCount} Cultural & Traditional Fests</span>
                </span>
              )}
            </div>

            {/* City Title & Tagline */}
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {activeCityInfo.name === 'All Kerala' ? 'Kerala Events & Festivals' : `Events in ${activeCityInfo.name}`}
                </h1>
                <span className="text-xs sm:text-sm font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {eventCount} active events nearby
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
                {activeCityInfo.tagline}
              </p>
            </div>

            {/* Cultural Signature Highlights */}
            {activeCityInfo.signatureCulture && (
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-amber-200/90 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-semibold text-amber-300">Heritage:</span>
                <span className="truncate">{activeCityInfo.signatureCulture}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={onOpenCityModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Change District or GPS</span>
              </button>

              {activeCityInfo.popularSpots && (
                <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400 pl-2">
                  <span>Popular hubs:</span>
                  {activeCityInfo.popularSpots.slice(0, 3).map((spot, i) => (
                    <span key={i} className="text-slate-200 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                      {spot}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* QUICK DISTRICT SELECTOR STRIP (WITH HORIZONTAL MOUSE WHEEL SCROLL) */}
        <div 
          ref={districtStripRef}
          onWheel={handleWheel}
          className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth"
        >
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0 uppercase tracking-wider pl-1">
            Districts:
          </span>
          {CITIES.map((city) => {
            const isSelected = city.name.toLowerCase() === currentCity.toLowerCase();
            return (
              <button
                key={city.id}
                onClick={() => onSelectCity(city.name)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 scale-[1.03] ring-1 ring-amber-300'
                    : 'liquid-glass-pill hover:scale-105 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="text-sm">{city.flag}</span>
                <span>{city.name}</span>
                {isSelected && (
                  <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
