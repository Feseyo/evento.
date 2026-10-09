import React, { useState } from 'react';
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
  ExternalLink, 
  Share2, 
  MessageSquare,
  Navigation,
  Trash2
} from 'lucide-react';
import { EventItem, Review, TicketTier, UserProfile } from '../types';

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
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'tickets' | 'reviews' | 'location'>('about');
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [imageError, setImageError] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // New review form state
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  // Update selected tier whenever event changes
  React.useEffect(() => {
    if (event && event.tickets.length > 0) {
      setSelectedTierId(event.tickets[0].id);
      setTicketQuantity(1);
      setLocalReviews(event.reviews);
      setActiveTab('about');
      setImageError(false);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const currentTier = event.tickets.find(t => t.id === selectedTierId) || event.tickets[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl liquid-glass rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header / Sticky Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {isAuthenticated && user && onDeleteEvent && (event.createdByUserId === user.id || event.organizer?.name?.includes('You') || (user.name && event.organizer?.name?.includes(user.name.split(' ')[0]))) && (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete your event "${event.title}"? This cannot be undone.`)) {
                  onDeleteEvent(event.id);
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-sm backdrop-blur-sm transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Delete your event"
              aria-label="Delete your event"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Event</span>
            </button>
          )}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-sm transition-all text-xs font-semibold flex items-center gap-1.5"
            title="Share event link"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare && <span className="text-[11px] text-indigo-600 dark:text-indigo-400">Copied!</span>}
          </button>
          <button
            onClick={(e) => onToggleSave(event.id, e)}
            className={`p-2.5 rounded-full backdrop-blur-sm shadow-sm transition-all ${
              isSaved ? 'bg-indigo-600 text-white' : 'bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save event'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-sm hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Media Banner */}
        <div className="relative h-64 sm:h-80 w-full shrink-0 bg-slate-900 overflow-hidden">
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
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges on hero */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-extrabold text-slate-900 rounded-full shadow-sm tabular-nums">
              {event.displayPrice}
            </span>
            <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-xs font-semibold text-white/90 rounded-full border border-white/10 uppercase tracking-wide">
              {event.category.replace('-', ' ')}
            </span>
          </div>

          {/* Hero text overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.displayDate}</span>
              <span>·</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{event.time}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
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
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/90 flex items-center gap-1 sm:gap-6 overflow-x-auto no-scrollbar shrink-0">
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
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'location'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Location & Venue
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ratings & Reviews ({localReviews.length})
          </button>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
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
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
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
                <span className="text-xs text-slate-500 dark:text-slate-400">Instant e-ticket delivery</span>
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

          {/* TAB 3: LOCATION & VENUE */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{event.venue}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{event.address}</span>
                </p>
              </div>

              {/* Simulated Interactive Map Card */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-inner flex flex-col items-center justify-center text-center p-6">
                {/* Background map grid styled SVG illustration */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Pin with ripple */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/30 rounded-full blur-2xs" />
                  </div>
                  <div className="mt-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-bold text-slate-900 dark:text-white">
                    {event.venue}
                  </div>
                </div>

                {/* External directions CTA */}
                <div className="absolute bottom-3 right-3 z-10">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${event.venue}, ${event.address}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Open in Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Transit & Arrival info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Public Transit:</span>
                  <p className="text-slate-500 dark:text-slate-400">Accessible via Kerala Metro, KSRTC buses, and auto-rickshaws right outside venue.</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Venue Entry Rules:</span>
                  <p className="text-slate-500 dark:text-slate-400">Gates open 45 minutes prior. Digital QR pass accepted at entry gate.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RATINGS & REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Overall Score */}
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
                  onClick={() => setShowAddReview(!showAddReview)}
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

        {/* Modal Sticky Bottom Purchase Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 shrink-0">
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
