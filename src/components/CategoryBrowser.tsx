import React from 'react';
import { 
  Music, 
  Trophy, 
  Mic2, 
  Users, 
  Handshake, 
  Sparkles,
  Layers,
  Flame
} from 'lucide-react';
import { EventCategory } from '../types';
import { ScrollReveal } from './ScrollExperience';

interface CategoryBrowserProps {
  selectedCategory: EventCategory | 'all';
  onSelectCategory: (cat: EventCategory | 'all') => void;
}

export const CategoryBrowser: React.FC<CategoryBrowserProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: {
    id: EventCategory;
    name: string;
    icon: React.ReactNode;
    cardBg: string;
    cardBorder: string;
    iconColor: string;
    activeRing: string;
  }[] = [
    {
      id: 'cultural',
      name: 'Cultural',
      icon: <Flame className="w-6 h-6" />,
      cardBg: 'bg-[#fffbeb] hover:bg-[#fef3c7] dark:bg-amber-950/20 dark:hover:bg-amber-950/40',
      cardBorder: 'border-amber-200 dark:border-amber-800/60',
      iconColor: 'text-amber-600 dark:text-amber-400',
      activeRing: 'ring-2 ring-amber-500 border-amber-400 bg-amber-100/70 dark:bg-amber-950/60 dark:border-amber-500',
    },
    {
      id: 'music',
      name: 'Music',
      icon: <Music className="w-6 h-6" />,
      cardBg: 'bg-[#f5f3ff] hover:bg-[#ede9fe] dark:bg-purple-950/20 dark:hover:bg-purple-950/40',
      cardBorder: 'border-purple-100 dark:border-purple-800/60',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      activeRing: 'ring-2 ring-indigo-500 border-indigo-400 bg-purple-100/70 dark:bg-purple-950/60 dark:border-indigo-500',
    },
    {
      id: 'football',
      name: 'Football',
      icon: <Trophy className="w-6 h-6" />,
      cardBg: 'bg-[#ecfdf5] hover:bg-[#d1fae5] dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40',
      cardBorder: 'border-emerald-100 dark:border-emerald-800/60',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 dark:border-emerald-500',
    },
    {
      id: 'concerts',
      name: 'Concerts',
      icon: <Mic2 className="w-6 h-6" />,
      cardBg: 'bg-[#fdf2f8] hover:bg-[#fce7f3] dark:bg-pink-950/20 dark:hover:bg-pink-950/40',
      cardBorder: 'border-pink-100 dark:border-pink-800/60',
      iconColor: 'text-pink-600 dark:text-pink-400',
      activeRing: 'ring-2 ring-pink-500 border-pink-400 bg-pink-100/70 dark:bg-pink-950/60 dark:border-pink-500',
    },
    {
      id: 'meetups',
      name: 'Meetups',
      icon: <Users className="w-6 h-6" />,
      cardBg: 'bg-[#eff6ff] hover:bg-[#dbeafe] dark:bg-blue-950/20 dark:hover:bg-blue-950/40',
      cardBorder: 'border-blue-100 dark:border-blue-800/60',
      iconColor: 'text-blue-600 dark:text-blue-400',
      activeRing: 'ring-2 ring-blue-500 border-blue-400 bg-blue-100/70 dark:bg-blue-950/60 dark:border-blue-500',
    },
    {
      id: 'company-collab',
      name: 'Company Collab',
      icon: <Handshake className="w-6 h-6" />,
      cardBg: 'bg-[#fff7ed] hover:bg-[#ffedd5] dark:bg-orange-950/20 dark:hover:bg-orange-950/40',
      cardBorder: 'border-amber-100 dark:border-orange-800/60',
      iconColor: 'text-amber-600 dark:text-orange-400',
      activeRing: 'ring-2 ring-amber-500 border-amber-400 bg-amber-100/70 dark:bg-orange-950/60 dark:border-amber-500',
    },
  ];

  return (
    <section id="categories-section" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <ScrollReveal direction="down">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Browse by category
              </h2>
              {selectedCategory !== 'all' && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Filtered: {selectedCategory}
                </span>
              )}
            </div>

            {selectedCategory !== 'all' && (
              <button
                onClick={() => onSelectCategory('all')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Show All Categories</span>
              </button>
            )}
          </div>
        </ScrollReveal>

        {/* 6 CATEGORY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <ScrollReveal key={cat.id} delayMs={idx * 60} direction="up">
                <button
                  onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                  className={`w-full flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 cursor-pointer group text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 overflow-hidden relative ${
                    isSelected 
                      ? `${cat.activeRing} shadow-md` 
                      : `liquid-glass-card hover:-translate-y-1`
                  }`}
                >
                  {/* Subtle liquid sheen reflection on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none liquid-shimmer" />

                  <div 
                    className={`mb-3 p-2 rounded-xl transition-transform duration-300 group-hover:scale-115 relative z-10 ${cat.iconColor}`}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white whitespace-nowrap relative z-10">
                    {cat.name}
                  </span>
                  {isSelected && (
                    <span className="mt-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 relative z-10">
                      Filter Active
                    </span>
                  )}
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
