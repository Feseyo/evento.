import React, { useState } from 'react';
import { MapPin, Bookmark, Star, ArrowRight, Trash2 } from 'lucide-react';
import { EventItem, UserProfile } from '../types';
import { ScrollReveal } from './ScrollExperience';

interface FeaturedEventsProps {
  events: EventItem[];
  currentCity: string;
  savedEventIds: string[];
  isAuthenticated: boolean;
  user?: UserProfile | null;
  onToggleSave: (eventId: string, e: React.MouseEvent) => void;
  onSelectEvent: (event: EventItem) => void;
  onDeleteEvent: (eventId: string, e: React.MouseEvent) => void;
  onChangeCity: () => void;
}

export const FeaturedEvents: React.FC<FeaturedEventsProps> = ({
  events,
  currentCity,
  savedEventIds,
  isAuthenticated,
  user,
  onToggleSave,
  onSelectEvent,
  onDeleteEvent,
  onChangeCity,
}) => {
  // Track image load errors to gracefully fallback to CSS gradient
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Compute events for the selected location
  const isAllKerala = currentCity.toLowerCase() === 'all kerala';
  
  const inCity = isAllKerala 
    ? events 
    : events.filter(e => e.city.toLowerCase() === currentCity.toLowerCase());

  // Prioritize featured events, followed by all other events in that location
  const featuredInCity = inCity.filter(e => e.featured);
  const remainingInCity = inCity.filter(e => !e.featured);
  let displayEvents = [...featuredInCity, ...remainingInCity].slice(0, 4);

  // If still fewer than 4 (e.g. custom newly added city), pad with other Kerala events
  if (displayEvents.length < 4) {
    const others = events.filter(e => !displayEvents.some(d => d.id === e.id));
    displayEvents = [...displayEvents, ...others].slice(0, 4);
  }

  return (
    <section id="featured-section" className="pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <ScrollReveal direction="down">
          <div className="flex items-baseline justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Featured in {isAllKerala ? 'Kerala' : currentCity}
              </h2>
              <button
                onClick={onChangeCity}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Change district
              </button>
            </div>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500 dark:text-slate-400">
              Handpicked {isAllKerala ? 'statewide' : `${currentCity}`} experiences ({displayEvents.length})
            </span>
          </div>
        </ScrollReveal>

        {/* 4 FEATURED CARDS GRID (Exact 4-column layout with staggered scroll reveal) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayEvents.map((event, idx) => {
            const isSaved = savedEventIds.includes(event.id);
            const hasError = imageErrors[event.id];

            return (
              <ScrollReveal key={event.id} delayMs={idx * 90} direction="up">
                <div
                  onClick={() => onSelectEvent(event)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${event.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectEvent(event);
                    }
                  }}
                >
                  {/* Background Image / Fallback Gradient */}
                  {hasError ? (
                    <div className={`absolute inset-0 bg-gradient-to-br ${event.fallbackGradient} flex items-center justify-center p-6 text-center`}>
                      <div className="space-y-2 opacity-80">
                        <div className="w-12 h-12 rounded-full bg-white/10 mx-auto flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-xs font-medium text-white/90">{event.title}</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={event.image}
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(event.id)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  )}

                  {/* Dark gradient scrim for legibility (matches reference photo contrast) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />

                  {/* Top Corner Badge & Actions */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold tracking-wide text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 tabular-nums">
                        {event.displayPrice}
                      </span>
                      {event.category === 'cultural' && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-200 bg-amber-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/40">
                          Cultural
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* DELETE BUTTON (ONLY VISIBLE FOR EVENTS CREATED BY THIS USER) */}
                      {isAuthenticated && user && (event.createdByUserId === user.id || event.organizer?.name?.includes('You') || (user.name && event.organizer?.name?.includes(user.name.split(' ')[0]))) && (
                        <button
                          onClick={(e) => onDeleteEvent(event.id, e)}
                          className="p-2 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
                          title="Delete your event"
                          aria-label="Delete your event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Bookmark button */}
                      <button
                        onClick={(e) => onToggleSave(event.id, e)}
                        className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
                          isSaved
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-black/40 hover:bg-black/60 text-white/80 hover:text-white'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save event'}
                        aria-label={isSaved ? 'Saved event' : 'Save event'}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 transition-transform ${isSaved ? 'fill-current scale-110' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Content Overlay (Matches reference layout) */}
                  <div className="absolute bottom-0 inset-x-0 p-4.5 z-10 flex flex-col justify-end">
                    {/* Date and time line in bold uppercase */}
                    <div className="flex items-center justify-between text-[11px] font-extrabold tracking-wider text-slate-300 uppercase mb-1 tabular-nums">
                      <span>{event.displayDate}</span>
                      <span className="text-[10px] font-semibold text-amber-400/90 lowercase">📍 {event.city}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
                      {event.title}
                    </h3>

                    {/* Location with Pin Icon */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );

};
