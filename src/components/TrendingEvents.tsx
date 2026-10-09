import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  Trash2 
} from 'lucide-react';
import { EventItem, EventCategory, UserProfile } from '../types';
import { ScrollReveal } from './ScrollExperience';

interface TrendingEventsProps {
  events: EventItem[];
  selectedCategory: EventCategory | 'all';
  searchQuery: string;
  savedEventIds: string[];
  isAuthenticated: boolean;
  user?: UserProfile | null;
  currentCity: string;
  onChangeCity?: (city: string) => void;
  onToggleSave: (eventId: string, e: React.MouseEvent) => void;
  onSelectEvent: (event: EventItem) => void;
  onDeleteEvent: (eventId: string, e: React.MouseEvent) => void;
  onClearFilters: () => void;
}

export const TrendingEvents: React.FC<TrendingEventsProps> = ({
  events,
  selectedCategory,
  searchQuery,
  savedEventIds,
  isAuthenticated,
  user,
  currentCity,
  onChangeCity,
  onToggleSave,
  onSelectEvent,
  onDeleteEvent,
  onClearFilters,
}) => {
  const [scopeFilter, setScopeFilter] = useState<'city' | 'all'>('city');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'under400' | 'under800' | 'above800'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'weekend' | 'october' | 'november'>('all');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const isAllKerala = currentCity.toLowerCase() === 'all kerala' || scopeFilter === 'all';

  // Filter events
  const filteredEvents = events.filter((event) => {
    // Location filter
    if (!isAllKerala && event.city.toLowerCase() !== currentCity.toLowerCase()) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && event.category !== selectedCategory) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        event.title.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        event.city.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Price filter (INR)
    if (priceFilter === 'free' && event.price > 0) return false;
    if (priceFilter === 'under400' && (event.price === 0 || event.price > 400)) return false;
    if (priceFilter === 'under800' && (event.price <= 400 || event.price > 800)) return false;
    if (priceFilter === 'above800' && event.price <= 800) return false;

    // Time filter
    if (timeFilter === 'weekend') {
      const date = new Date(event.date);
      const day = date.getDay(); // 0 is Sunday, 6 is Saturday
      if (day !== 0 && day !== 6 && day !== 5) return false;
    } else if (timeFilter === 'october') {
      if (!event.date.startsWith('2026-10')) return false;
    } else if (timeFilter === 'november') {
      if (!event.date.startsWith('2026-11')) return false;
    }

    return true;
  });

  const cityEventsCount = events.filter(e => e.city.toLowerCase() === currentCity.toLowerCase()).length;
  const hasActiveFilters = selectedCategory !== 'all' || searchQuery.trim() !== '' || priceFilter !== 'all' || timeFilter !== 'all';

  return (
    <section id="trending-section" className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER & FILTER CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Trending events {!isAllKerala ? `in ${currentCity}` : 'across Kerala'}
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {filteredEvents.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {!isAllKerala 
                ? `Showing happenings specifically in ${currentCity}. Switch to All Kerala for statewide view.` 
                : 'Popular festivals, sports derbies, and cultural arts across all districts'}
            </p>
          </div>

          {/* Quick filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Location Scope Toggle */}
            {currentCity.toLowerCase() !== 'all kerala' && (
              <div className="flex items-center gap-1 liquid-glass-pill p-1 rounded-xl">
                <button
                  onClick={() => setScopeFilter('city')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    scopeFilter === 'city'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  📍 In {currentCity} ({cityEventsCount})
                </button>
                <button
                  onClick={() => setScopeFilter('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    scopeFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🌴 All Kerala ({events.length})
                </button>
              </div>
            )}

            {/* Price Filter Pills */}
            <div className="flex items-center gap-1 liquid-glass-pill p-1 rounded-xl">
              <button
                onClick={() => setPriceFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  priceFilter === 'all' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPriceFilter('free')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  priceFilter === 'free' 
                    ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-2xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setPriceFilter('under400')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  priceFilter === 'under400' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ≤ ₹400
              </button>
              <button
                onClick={() => setPriceFilter('above800')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  priceFilter === 'above800' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ₹800+
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setPriceFilter('all');
                  setTimeFilter('all');
                  onClearFilters();
                }}
                className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No matching events found in {currentCity}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
              Try adjusting your category, price range, or explore all events happening across Kerala.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setScopeFilter('all')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Explore All Kerala ({events.length} events)
              </button>
              <button
                onClick={() => {
                  setPriceFilter('all');
                  setTimeFilter('all');
                  onClearFilters();
                }}
                className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          /* 3x2 EVENT CARDS GRID (Matches screenshot layout with staggered scroll reveal) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => {
              const isSaved = savedEventIds.includes(event.id);
              const hasError = imageErrors[event.id];

              return (
                <ScrollReveal key={event.id} delayMs={(idx % 6) * 60} direction="up">
                  <div
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-md dark:shadow-slate-950/50 transition-all duration-300 flex flex-col cursor-pointer relative h-full"
                    onClick={() => onSelectEvent(event)}
                  >
                    {/* Card Image Area with Price Badge on Top-Left */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {hasError ? (
                        <div className={`w-full h-full bg-gradient-to-br ${event.fallbackGradient} flex items-center justify-center p-4`}>
                          <div className="text-center text-white/90">
                            <MapPin className="w-8 h-8 mx-auto mb-1 opacity-70" />
                            <span className="text-xs font-semibold">{event.venue}</span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={event.image}
                          alt={event.title}
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(event.id)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      )}

                      {/* Price Tag Badge & Cultural Tag */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                        <span className="inline-block px-3 py-1 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold text-slate-900 dark:text-white rounded-lg shadow-sm border border-black/5 dark:border-white/10 tabular-nums">
                          {event.displayPrice}
                        </span>
                        {event.category === 'cultural' && (
                          <span className="inline-block px-2.5 py-0.5 bg-amber-500/95 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-slate-950 rounded-lg shadow-sm">
                            Cultural
                          </span>
                        )}
                      </div>

                      {/* City Location Tag on Image */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-slate-200 rounded-md border border-white/10">
                          <MapPin className="w-2.5 h-2.5 text-amber-400" />
                          <span>{event.city}</span>
                        </span>
                      </div>

                      {/* DELETE EVENT BUTTON (ONLY VISIBLE FOR EVENTS CREATED BY THIS USER) */}
                      {isAuthenticated && user && (event.createdByUserId === user.id || event.organizer?.name?.includes('You') || (user.name && event.organizer?.name?.includes(user.name.split(' ')[0]))) && (
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600/90 text-white shadow-sm backdrop-blur-md">
                            Your Event
                          </span>
                          <button
                            onClick={(e) => onDeleteEvent(event.id, e)}
                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white backdrop-blur-md transition-all shadow-sm cursor-pointer"
                            title="Delete your event"
                            aria-label="Delete your event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card Bottom Area: Title + Venue/Date on Left, "Interested" Button on Right */}
                    <div className="p-4 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 flex-1">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                          <span>{event.displayDate}</span>
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>

                      {/* Interested Button (Matches screenshot) */}
                      <button
                        onClick={(e) => onToggleSave(event.id, e)}
                        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                          isSaved
                            ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs'
                            : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
                        }`}
                        title={isSaved ? 'Marked as Interested' : 'Mark as Interested'}
                        aria-label="Interested in event"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-transform ${
                            isSaved ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400 scale-110' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                          }`}
                        />
                        <span>{isSaved ? 'Saved' : 'Interested'}</span>
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
