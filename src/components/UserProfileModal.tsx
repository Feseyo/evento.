import React, { useState } from 'react';
import { 
  X, 
  Ticket, 
  Heart, 
  Settings, 
  Calendar, 
  MapPin, 
  Trash2, 
  ExternalLink, 
  QrCode, 
  Check, 
  Bell, 
  User, 
  Mail, 
  Phone,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { UserProfile, EventItem, Booking, EventCategory } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'tickets' | 'saved' | 'settings' | 'hosted';
  user: UserProfile | null;
  isAuthenticated: boolean;
  events: EventItem[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onViewBookingPass: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onSelectEvent: (event: EventItem) => void;
  onRemoveSaved: (eventId: string) => void;
  onDeleteEvent?: (eventId: string) => void;
  onOpenHostModal?: () => void;
  onOpenAuthModal: () => void;
  onNavigateTrending?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'tickets',
  user,
  isAuthenticated,
  events,
  onUpdateUser,
  onViewBookingPass,
  onCancelBooking,
  onSelectEvent,
  onRemoveSaved,
  onDeleteEvent,
  onOpenHostModal,
  onOpenAuthModal,
  onNavigateTrending,
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'saved' | 'settings' | 'hosted'>(initialTab);
  
  // Settings form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'London');
  const [emailNotifications, setEmailNotifications] = useState(user?.emailNotifications ?? true);
  const [nearbyAlerts, setNearbyAlerts] = useState(user?.nearbyAlerts ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    setActiveTab(initialTab);
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setCity(user.city);
    }
  }, [initialTab, isOpen, user]);

  if (!isOpen) return null;

  const savedEventsList = user ? events.filter(e => user.savedEventIds.includes(e.id)) : [];
  
  // Find events created/hosted by this authenticated user
  const hostedEventsList = user 
    ? events.filter(e => e.createdByUserId === user.id || e.organizer.name.includes('You') || e.organizer.name.includes(user.name.split(' ')[0]))
    : [];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      phone,
      city,
      emailNotifications,
      nearbyAlerts,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl liquid-glass rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
              alt={user?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-800 shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isAuthenticated ? (user?.name || 'User') : 'Guest Profile'}
                </h3>
                {isAuthenticated ? (
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
                    Authenticated
                  </span>
                ) : (
                  <button
                    onClick={onOpenAuthModal}
                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAuthenticated ? `${user?.email || ''} · ${user?.city || 'Kochi'}` : 'Sign in to access synced tickets and host events'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Tiles Bar (View Tickets & Host Event front and center for all devices) */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* 1. Quick Action: View Tickets */}
            <button
              onClick={() => setActiveTab('tickets')}
              className={`p-2 sm:p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                activeTab === 'tickets'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 shadow-2xs'
                  : 'bg-white/80 dark:bg-slate-800/80 border-slate-200/70 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-750'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Ticket className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">View Tickets</span>
                  {user && user.bookings.length > 0 && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-500 text-white rounded-full tabular-nums">
                      {user.bookings.length}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.bookings.length ? `${user.bookings.length} confirmed` : 'View passes & QR'}
                </p>
              </div>
            </button>

            {/* 2. Quick Action: Host Event */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuthModal();
                } else if (onOpenHostModal) {
                  onClose();
                  onOpenHostModal();
                } else {
                  setActiveTab('hosted');
                }
              }}
              className="p-2 sm:p-2.5 rounded-xl border bg-gradient-to-r from-indigo-50/90 to-amber-50/70 dark:from-indigo-950/50 dark:to-amber-950/40 border-indigo-200/80 dark:border-indigo-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-2xs transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-indigo-600 text-white group-hover:scale-105 transition-transform shrink-0">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 truncate">Host Event</span>
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  </div>
                  <p className="text-[10px] text-indigo-700/80 dark:text-indigo-300/80 truncate">
                    Create & publish now
                  </p>
                </div>
              </div>
            </button>

            {/* 3. Quick Action: Saved Events */}
            <button
              onClick={() => setActiveTab('saved')}
              className={`hidden sm:flex p-2 sm:p-2.5 rounded-xl border items-center gap-2.5 transition-all text-left cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 shadow-2xs'
                  : 'bg-white/80 dark:bg-slate-800/80 border-slate-200/70 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-750'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">Saved</span>
                  {savedEventsList.length > 0 && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold bg-rose-500 text-white rounded-full tabular-nums">
                      {savedEventsList.length}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {savedEventsList.length} bookmarked
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900 flex items-center gap-2 sm:gap-6 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-3 px-1 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'tickets'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>View Tickets ({user?.bookings.length || 0})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('hosted')}
            className={`py-3 px-1 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'hosted'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Host Event ({hostedEventsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3 px-1 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'saved'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved ({savedEventsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-1 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: VIEW TICKETS / EVENT PASSES */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-500" />
                    <span>Your Confirmed Event Passes</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Show your digital QR pass at the entrance gate for quick verification
                  </p>
                </div>
                {user && user.bookings.length > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 tabular-nums">
                    {user.bookings.length} Passes Active
                  </span>
                )}
              </div>

              {!user || user.bookings.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800/60">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No event passes booked yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      When you book tickets for concerts, football derbies, or workshops across Kerala, your passes appear here.
                    </p>
                  </div>
                  {onNavigateTrending && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateTrending();
                      }}
                      className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Explore Trending Events
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {user.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={booking.eventImage}
                          alt={booking.eventTitle}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                              {booking.ticketTierName}
                            </span>
                            <span className="text-[11px] font-mono font-semibold text-slate-400">
                              #{booking.id}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                            {booking.eventTitle}
                          </h5>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {booking.eventDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {booking.eventVenue}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => onViewBookingPass(booking)}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View Ticket & QR Pass</span>
                        </button>
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer"
                          title="Cancel Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HOST EVENT (CREATE & MANAGE HOSTED EVENTS) */}
          {activeTab === 'hosted' && (
            <div className="space-y-4">
              {/* Host Event Action Header Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-indigo-50/50 to-amber-50/60 dark:from-indigo-950/40 dark:via-indigo-900/20 dark:to-amber-950/20 border border-indigo-200/80 dark:border-indigo-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Host an Event on Evento
                    </h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/70 rounded-full">
                      Kerala
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md">
                    Reach thousands of attendees across Kochi, Trivandrum, Kozhikode, and all districts. Setup tickets and verify entry passes.
                  </p>
                </div>
                
                {isAuthenticated ? (
                  onOpenHostModal && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenHostModal();
                      }}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Host New Event</span>
                    </button>
                  )
                ) : (
                  <button
                    onClick={onOpenAuthModal}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors shrink-0 cursor-pointer"
                  >
                    Sign In to Host
                  </button>
                )}
              </div>

              {/* Authenticated User Hosted List or Empty State */}
              {isAuthenticated ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Your Hosted Events ({hostedEventsList.length})
                    </h5>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Only you can view and manage your hosted events
                    </span>
                  </div>

                  {hostedEventsList.length === 0 ? (
                    <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <Sparkles className="w-9 h-9 text-indigo-400 mx-auto mb-1" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">You haven't hosted any events yet</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Publish your first concert, sports match, tech meetup, or cultural festival in minutes.
                      </p>
                      {onOpenHostModal && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenHostModal();
                          }}
                          className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          Create Your First Event
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {hostedEventsList.map((event) => (
                        <div
                          key={event.id}
                          className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded uppercase">
                                {event.category}
                              </span>
                              <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                                {event.title}
                              </h5>
                              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  {event.displayDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {event.venue}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => {
                                onClose();
                                onSelectEvent(event);
                              }}
                              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                              View Event
                            </button>
                            
                            {onDeleteEvent && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
                                    onDeleteEvent(event.id);
                                  }
                                }}
                                className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                                title="Delete this event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <User className="w-8 h-8 text-indigo-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Sign in to host and manage events</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Organizers can manage attendee lists, check-in guests with QR tickets, and publish new events.
                  </p>
                  <button
                    onClick={onOpenAuthModal}
                    className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Sign In to Host
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED EVENTS */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Bookmarked Events ({savedEventsList.length})
                </h4>
                <span className="text-xs text-slate-400">Never miss tickets</span>
              </div>

              {savedEventsList.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No saved events yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Click "Interested" on any event card to save it here for quick access later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedEventsList.map((event) => (
                    <div
                      key={event.id}
                      className="p-3.5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all"
                    >
                      <div 
                        onClick={() => {
                          onClose();
                          onSelectEvent(event);
                        }}
                        className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                      >
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate hover:text-indigo-600 dark:hover:text-indigo-400">
                            {event.title}
                          </h5>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                            {event.displayDate}
                          </span>
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                            {event.displayPrice}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectEvent(event);
                          }}
                          className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Book
                        </button>
                        <button
                          onClick={() => onRemoveSaved(event.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USER SETTINGS & PREFERENCES */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Account Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Profile Information</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Default City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Notification Preferences</span>
                </h4>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Nearby Event Alerts</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Get notified when new gigs, matches or meetups are announced in your city</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={nearbyAlerts}
                      onChange={(e) => setNearbyAlerts(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Email Newsletters & Passes</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Receive booking confirmations, calendar reminders and early bird presales</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {savedSuccess && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Settings saved!</span>
                  </span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
