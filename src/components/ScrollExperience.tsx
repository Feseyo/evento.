import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUp, 
  MapPin, 
  Flame, 
  Sparkles, 
  Compass, 
  ChevronDown,
  Layers,
  ChevronUp
} from 'lucide-react';

interface ScrollExperienceProps {
  currentCity: string;
  onOpenCityPicker: () => void;
  onNavigateTrending: () => void;
}

/**
 * Unique Scroll Experience Component
 * - Glowing Kerala progress bar along the top
 * - Floating glassmorphic dock with active section indicator, progress ring & smooth top scroll
 * - Quick jump to Trending and district switch
 */
export const ScrollExperience: React.FC<ScrollExperienceProps> = ({
  currentCity,
  onOpenCityPicker,
  onNavigateTrending,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState<'hero' | 'featured' | 'categories' | 'trending' | 'host'>('hero');
  const [showFloatingDock, setShowFloatingDock] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
          
          setScrollProgress(Math.min(100, Math.max(0, progress)));
          setScrollY(currentScroll);
          setShowFloatingDock(currentScroll > 260);

          // Detect active section
          const heroEl = document.getElementById('hero-section');
          const featuredEl = document.getElementById('featured-section');
          const categoriesEl = document.getElementById('categories-section');
          const trendingEl = document.getElementById('trending-section');
          const hostEl = document.getElementById('host-callout-section');

          const probeY = currentScroll + 240;

          if (hostEl && probeY >= hostEl.offsetTop) {
            setActiveSection('host');
          } else if (trendingEl && probeY >= trendingEl.offsetTop) {
            setActiveSection('trending');
          } else if (categoriesEl && probeY >= categoriesEl.offsetTop) {
            setActiveSection('categories');
          } else if (featuredEl && probeY >= featuredEl.offsetTop) {
            setActiveSection('featured');
          } else {
            setActiveSection('hero');
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const getSectionLabel = () => {
    switch (activeSection) {
      case 'hero':
        return { label: `Explore ${currentCity}`, icon: <Compass className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '8s' }} /> };
      case 'featured':
        return { label: 'Featured Events', icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> };
      case 'categories':
        return { label: 'Event Categories', icon: <Layers className="w-3.5 h-3.5 text-blue-500" /> };
      case 'trending':
        return { label: 'Trending Feed', icon: <Flame className="w-3.5 h-3.5 text-rose-500" /> };
      case 'host':
        return { label: 'Host Studio', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> };
      default:
        return { label: currentCity, icon: <MapPin className="w-3.5 h-3.5 text-indigo-500" /> };
    }
  };

  const currentInfo = getSectionLabel();

  // Circle progress calculation (circumference: 2 * PI * r)
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* 1. TOP GLOWING KERALA SCROLL PROGRESS BAR */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none"
        aria-hidden="true"
      >
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400 shadow-[0_0_12px_rgba(245,158,11,0.65)] transition-all duration-75 ease-out rounded-r-full"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. FLOATING LIQUID GLASS SCROLL DOCK */}
      <aside
        aria-label="Quick page navigation"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-400 ease-out transform ${
          showFloatingDock 
            ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' 
            : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 px-3.5 py-2 rounded-full liquid-glass shadow-2xl text-slate-800 dark:text-slate-100 transition-colors">
          
          {/* Active Section Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill text-xs font-bold text-slate-800 dark:text-slate-200">
            {currentInfo.icon}
            <span className="truncate max-w-[110px] sm:max-w-[150px]">{currentInfo.label}</span>
          </div>

          {/* Quick District Badge Button */}
          <button
            onClick={onOpenCityPicker}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-slate-100/70 dark:hover:bg-slate-800/70 text-[11px] font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            title="Change Kerala district"
          >
            <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="truncate max-w-[80px]">{currentCity}</span>
          </button>

          {/* Jump to Trending (only visible when above trending) */}
          {activeSection !== 'trending' && activeSection !== 'host' && (
            <button
              onClick={onNavigateTrending}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50/80 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 text-[11px] font-bold transition-all cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60"
              title="Jump down to Trending feed"
            >
              <span>Feed</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          )}

          {/* Circular Progress Gauge & Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer ml-1"
            title={`Scrolled ${Math.round(scrollProgress)}% - Click to return to top`}
            aria-label="Scroll back to top"
          >
            {/* SVG Circular Ring around button */}
            <svg className="absolute -inset-1 w-10 h-10 -rotate-90 pointer-events-none">
              <circle
                cx="20"
                cy="20"
                r={radius}
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r={radius}
                className="text-amber-400"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
              />
            </svg>

            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>

        </div>
      </aside>
    </>
  );
};

/**
 * Reusable Scroll Reveal Wrapper
 * - Uses Intersection Observer to create a smooth staggered reveal effect when elements enter the screen.
 */
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delayMs = 0,
  direction = 'up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getTransformClasses = () => {
    if (isVisible) {
      return 'opacity-100 translate-y-0 translate-x-0 scale-100';
    }

    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-8 scale-[0.98]';
      case 'down':
        return 'opacity-0 -translate-y-8 scale-[0.98]';
      case 'left':
        return 'opacity-0 translate-x-8 scale-[0.98]';
      case 'right':
        return 'opacity-0 -translate-x-8 scale-[0.98]';
      case 'fade':
      default:
        return 'opacity-0 scale-[0.97]';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out will-change-transform ${getTransformClasses()} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
};
