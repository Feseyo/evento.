import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Heart, 
  Star, 
  ShieldCheck, 
  Users, 
  Ticket, 
  CheckCircle2, 
  Share2, 
  Trash2,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  Navigation,
  Compass
} from 'lucide-react';
import { EventItem, Review, TicketTier, UserProfile } from '../types';
import { EventRouteMap } from './EventRouteMap';

interface EventDetailModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  isAuthenticated: boolean;
  user?: UserProfile | null;
  onToggleSave: (eventId: string, e: React.MouseEvent) => void;
  onBookEvent: (event: EventItem, selectedTier: TicketTier, quantity: number) => void;
  onDeleteEvent?: (eventId: string) => void;
  onPromptAuth?: (prompt: string, mode?: 'signin' | 'signup') => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  isSaved,
  isAuthenticated,
  user,
  onToggleSave,
  onBookEvent,
  onDeleteEvent,
  onPromptAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'tickets' | 'location' | 'reviews'>('about');
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [imageError, setImageError] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Scrolling & image move up state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMovedUp, setIsMovedUp] = useState<boolean>(false);

  // Review form state
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  // Reset and update tier on event change
  useEffect(() => {
    if (event && event.tickets.length > 0) {
      setSelectedTierId(event.tickets[0].id);
      setTicketQuantity(1);
      setLocalReviews(event.reviews);
      setActiveTab('about');
      setImageError(false);
      setScrollProgress(0);
      setIsMovedUp(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const currentTier = event.tickets.find(t => t.id === selectedTierId) || event.tickets[0];

  // Creator & Admin check
  const isCreator = Boolean(user && event.createdByUserId && event.createdByUserId === user.id);
  const isAdmin = user?.role === 'admin';
  const canDelete = isAuthenticated && user && (isAdmin || isCreator);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const progress = maxScroll > 0 ? Math.min(100, Math.round((scrollTop / maxScroll) * 100)) : 0;
    setScrollProgress(progress);
    setIsMovedUp(scrollTop > 180);
  };

  const handleSliderScroll = (value: number) => {
    setScrollProgress(value);
    if (!scrollContainerRef.current) return;
    const { scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const targetScroll = (value / 100) * maxScroll;
    scrollContainerRef.current.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  const toggleMoveImageUp = () => {
    if (!scrollContainerRef.current) return;
    if (isMovedUp) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMovedUp(false);
      setScrollProgress(0);
    } else {
      // Scroll past hero image to tabs and details
      scrollContainerRef.current.scrollTo({ top: 290, behavior: 'smooth' });
      setIsMovedUp(true);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (onPromptAuth) {
        onPromptAuth('Sign in or create an account to submit your event review.', 'signin');
      }
      return;
    }
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userName: reviewName.trim(),
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      rating: reviewRating,
      date: 'Just now',
      comment: reviewComment.trim(),
    };

    setLocalReviews([newRev, ...localReviews]);
    setReviewName('');
    setReviewComment('');
    setShowAddReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl liquid-glass rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Floating Top Bar (Controls & Small Scroll Slider) */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
          {/* Small Scroll Bar / Slider to move image up */}
          <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white shadow-xl">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-indigo-400" />
              <span className="hidden sm:inline">Image scroll:</span>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={scrollProgress}
              onChange={(e) => handleSliderScroll(Number(e.target.value))}
              aria-label="Move image up and down to see details"
              className="w-16 sm:w-28 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              title="Move image up or down to see rest of details"
            />
            <button
              onClick={toggleMoveImageUp}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white transition-all cursor-pointer shadow-xs"
              title="Toggle image position to see full details"
            >
              {isMovedUp ? (
                <>
                  <ChevronDown className="w-3 h-3" />
                  <span>Expand Image</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3 h-3" />
                  <span>Move Image Up</span>
                </>
              )}
            </button>
          </div>

          {/* Action buttons (Delete, Share, Save, Close) */}
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            {canDelete && onDeleteEvent && (
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${event.title}"? This cannot be undone.`)) {
                    onDeleteEvent(event.id);
                    onClose();
                  }
                }}
                className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg backdrop-blur-sm transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title={isAdmin ? "Delete Event (Admin Privilege)" : "Delete Your Hosted Event"}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAdmin && !isCreator ? 'Admin Delete' : 'Delete Event'}</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg backdrop-blur-sm transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/10"
              title="Share event link"
            >
              <Share2 className="w-4 h-4" />
              {copiedShare && <span className="text-[11px] text-indigo-400">Copied!</span>}
            </button>

            <button
              onClick={(e) => onToggleSave(event.id, e)}
              className={`p-2.5 rounded-full backdrop-blur-sm shadow-lg transition-all cursor-pointer border border-white/10 ${
                isSaved ? 'bg-indigo-600 text-white' : 'bg-slate-900/80 hover:bg-slate-900 text-white'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save event'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg backdrop-blur-sm hover:text-rose-400 transition-colors cursor-pointer border border-white/10"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container with Unified Small Scrollbar */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-y-auto flex-1 small-scrollbar relative"
        >
          {/* Hero Media Banner (Scrolls Up Seamlessly) */}
          <div className="relative h-72 sm:h-96 w-full bg-slate-900 overflow-hidden">
            {imageError ? (
              <div className={`w-full h-full bg-gradient-to-br ${event.fallbackGradient} flex items-center justify-center`}>
                <div className="text-white text-center p-6">
                  <Ticket className="w-12 h-12 mx-auto mb-2 opacity-80" />
                  <h3 className="text-xl font-bold">{event.title}</h3>
                </div>
              </div>
            ) : (
              <img
                src={event.image}
                alt={event.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

            {/* Badges on hero */}
            <div className="absolute top-16 left-4 sm:left-6 z-10 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-extrabold text-slate-900 rounded-full shadow-sm tabular-nums">
                {event.displayPrice}
              </span>
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-xs font-semibold text-white rounded-full border border-white/10 uppercase tracking-wide">
                {event.category.replace('-', ' ')}
              </span>
              {event.trending && (
                <span className="px-2.5 py-1 bg-rose-600/90 text-white text-[11px] font-bold rounded-full shadow-xs">
                  🔥 Trending
                </span>
              )}
            </div>

            {/* Hero text overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>{event.displayDate}</span>
                <span>·</span>
                <Clock className="w-3.5 h-3.5" />
                <span>{event.time}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{event.venue}, {event.city}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{event.rating}</span>
                  <span className="text-slate-400 font-normal">({event.reviewsCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{event.attendeesCount.toLocaleString()} attendees</span>
                </div>
              </div>

              {/* Interactive prompt to scroll/move image up */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={toggleMoveImageUp}
                  className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-white/15 hover:bg-white/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 transition-all cursor-pointer font-medium"
                >
                  <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                  <span>Move image up to explore details & route</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Tab Navigation Bar */}
          <div className="sticky top-0 z-20 border-y border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between overflow-x-auto no-scrollbar shadow-xs">
            <div className="flex items-center gap-1 sm:gap-6">
              <button
                onClick={() => setActiveTab('about')}
                className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'about'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                About & Highlights
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'tickets'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tickets ({event.tickets.length})
              </button>
              <button
                onClick={() => setActiveTab('location')}
                className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'location'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Route & Google Map</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Reviews ({localReviews.length})
              </button>
            </div>

            {/* Quick mini-indicator */}
            <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden md:inline">
              Scrolls smoothly with small scrollbar
            </span>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* TAB 1: ABOUT */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                {/* Event Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Event Description</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {event.longDescription || event.description}
                  </p>
                </div>

                {/* Event Tags */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Tags & Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200/60 dark:border-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Organizer Card */}
                <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={event.organizer.avatar}
                      alt={event.organizer.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{event.organizer.name}</span>
                        {event.organizer.verified && (
                          <span title="Verified Organizer">
                            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {event.organizer.eventsHosted} events hosted on Evento
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('tickets')}
                    className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Book Tickets
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: TICKETS */}
            {activeTab === 'tickets' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Select Ticket Tier</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Instant e-ticket with QR Pass</span>
                </div>

                <div className="space-y-3">
                  {event.tickets.map((tier) => {
                    const isTierSelected = selectedTierId === tier.id;

                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isTierSelected
                            ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/70'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{tier.name}</span>
                            {tier.price === 0 ? (
                              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-md uppercase">
                                Free
                              </span>
                            ) : (
                              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                                ₹{tier.price}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{tier.description}</p>
                          
                          {/* Perks */}
                          <div className="flex flex-wrap gap-2 pt-1.5">
                            {tier.perks.map((perk) => (
                              <span
                                key={perk}
                                className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span>{perk}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Select radio */}
                        <div className="shrink-0 flex items-center justify-end">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isTierSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {isTierSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quantity selector */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Quantity</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Max 6 tickets per booking</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      disabled={ticketQuantity <= 1}
                      className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center tabular-nums text-slate-900 dark:text-white">{ticketQuantity}</span>
                    <button
                      onClick={() => setTicketQuantity(Math.min(6, ticketQuantity + 1))}
                      disabled={ticketQuantity >= 6}
                      className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ROUTE & GOOGLE MAP */}
            {activeTab === 'location' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{event.venue}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>{event.address}, {event.city}</span>
                    </p>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 w-fit">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Real-Time Route Map</span>
                  </span>
                </div>

                {/* Google Maps Route Component */}
                <EventRouteMap event={event} />

                {/* Venue Arrival Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Public Transit & Metro:</span>
                    <p className="text-slate-500 dark:text-slate-400">Conveniently linked to city Metro and public bus corridors. Auto and cab pick-up zones right outside.</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Venue Entry Rules:</span>
                    <p className="text-slate-500 dark:text-slate-400">Entry gates open 45 minutes prior to scheduled start. Digital QR pass on your phone is scanned at entry.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {event.rating}
                    </div>
                    <div>
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                        Based on {event.reviewsCount} verified reviews
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        if (onPromptAuth) {
                          onPromptAuth('Sign in or create an account to share your event review.', 'signin');
                        }
                        return;
                      }
                      setShowAddReview(!showAddReview);
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors shrink-0 cursor-pointer"
                  >
                    {showAddReview ? 'Cancel Review' : 'Write a Review'}
                  </button>
                </div>

                {/* Review Form */}
                {showAddReview && (
                  <form onSubmit={handleAddReview} className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/30 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Share your experience</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        required
                        className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:border-indigo-500"
                      />
                      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              type="button"
                              key={num}
                              onClick={() => setReviewRating(num)}
                              className={`p-0.5 cursor-pointer ${num <= reviewRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <textarea
                      placeholder="Tell other event goers about the vibe, crowd, sound, or venue..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:border-indigo-500"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-3">
                  {localReviews.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">No reviews written yet. Be the first to share your thoughts!</p>
                  ) : (
                    localReviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={rev.userAvatar}
                              alt={rev.userName}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{rev.userName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= rev.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{rev.date}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Sticky Bottom Purchase Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 shrink-0 shadow-lg">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              {currentTier.price === 0 ? 'Free Registration' : `Total (${ticketQuantity} ${ticketQuantity === 1 ? 'ticket' : 'tickets'}):`}
            </span>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {currentTier.price === 0 ? 'Free' : `₹${currentTier.price * ticketQuantity}`}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onBookEvent(event, currentTier, ticketQuantity)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>{currentTier.price === 0 ? 'Register for Free' : 'Book Tickets Now'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
