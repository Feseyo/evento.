/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FeaturedEvents } from './components/FeaturedEvents';
import { CategoryBrowser } from './components/CategoryBrowser';
import { TrendingEvents } from './components/TrendingEvents';
import { HostEventCallout } from './components/HostEventCallout';
import { Footer } from './components/Footer';
import { EventDetailModal } from './components/EventDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketPassModal } from './components/TicketPassModal';
import { UserProfileModal } from './components/UserProfileModal';
import { HostEventModal } from './components/HostEventModal';
import { CalendarModal } from './components/CalendarModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { AuthModal } from './components/AuthModal';
import { CityHeroBanner } from './components/CityHeroBanner';
import { ScrollExperience } from './components/ScrollExperience';
import { LiquidGlassBackground } from './components/LiquidGlassBackground';
import { INITIAL_EVENTS } from './data/mockEvents';
import { EventItem, EventCategory, TicketTier, Booking, UserProfile } from './types';
import { sounds } from './utils/soundEffects';

const GUEST_USER: UserProfile = {
  id: 'guest-visitor',
  name: 'Guest User',
  email: 'guest@evento.in',
  phone: '',
  city: 'Kochi',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'guest',
  savedEventIds: [],
  bookings: [],
  interests: ['music', 'football'],
  emailNotifications: false,
  nearbyAlerts: false,
};

const DEFAULT_LOGIN_USER: UserProfile = {
  id: 'usr-sooraj-9495',
  name: 'Sooraj S',
  email: 'soorajs9495@gmail.com',
  phone: '+91 94950 12345',
  city: 'Kochi',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'user',
  savedEventIds: ['koc-feat-1', 'koc-feat-2'],
  bookings: [
    {
      id: 'EVT-KL-849201',
      eventId: 'koc-feat-1',
      eventTitle: 'Neon Nights: Kerala Music Festival',
      eventImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      eventDate: '12 OCT · 20:00',
      eventTime: '20:00 - 01:00',
      eventVenue: 'Bolgatty Palace Grounds, Kochi',
      eventCity: 'Kochi',
      ticketTierName: 'General Admission Pass',
      quantity: 2,
      totalPaid: 1598,
      bookingDate: '3 Oct 2026',
      attendeeName: 'Sooraj S',
      attendeeEmail: 'soorajs9495@gmail.com',
      attendeePhone: '+91 94950 12345',
      paymentMethod: 'Google Pay (UPI)',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=EVENTO-PASS-EVT-KL-849201',
      status: 'confirmed',
    }
  ],
  interests: ['music', 'football', 'company-collab'],
  emailNotifications: true,
  nearbyAlerts: true,
};

export default function App() {
  // Authentication State: Default FALSE so every visitor begins as a guest user
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('evento_auth');
      return stored !== null ? JSON.parse(stored) : false; // Default guest user
    } catch {
      return false;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActivityPrompt, setAuthActivityPrompt] = useState<string | null>(null);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');

  const openAuthWithPrompt = (prompt: string, mode: 'signin' | 'signup' = 'signin') => {
    setAuthActivityPrompt(prompt);
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  // Core Events State
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('evento_events_v2');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  // Current City Location
  const [currentCity, setCurrentCity] = useState<string>('Kochi');

  // Active Category Filter ('all' or specific category)
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');

  // Search keyword
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User Profile & Preferences State
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const storedAuth = localStorage.getItem('evento_auth');
      const isAuth = storedAuth !== null ? JSON.parse(storedAuth) : false;
      const savedUser = localStorage.getItem('evento_user_v2');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return isAuth ? parsed : { ...parsed, role: 'guest' };
      }
      return isAuth ? DEFAULT_LOGIN_USER : GUEST_USER;
    } catch {
      return GUEST_USER;
    }
  });

  // Modals & Drawers state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Booking & Checkout state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<TicketTier | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);

  // Ticket Pass View
  const [activePass, setActivePass] = useState<Booking | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Profile Modal
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'tickets' | 'saved' | 'settings' | 'hosted'>('tickets');

  // Other Modals
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('evento_events_v2', JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('evento_user_v2', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('evento_auth', JSON.stringify(isAuthenticated));
    } catch (e) {
      console.error(e);
    }
  }, [isAuthenticated]);

  // Toggle Save Event (Interested)
  const handleToggleSave = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please sign in or create an account to save events.');
      openAuthWithPrompt('Sign in or create an account to save events to your profile.', 'signin');
      return;
    }
    const isAlreadySaved = user.savedEventIds.includes(eventId);
    const updatedSaved = isAlreadySaved
      ? user.savedEventIds.filter(id => id !== eventId)
      : [...user.savedEventIds, eventId];

    setUser(prev => ({
      ...prev,
      savedEventIds: updatedSaved,
    }));

    const event = events.find(item => item.id === eventId);
    const title = event ? event.title : 'Event';
    sounds.playLike(!isAlreadySaved);
    if (!isAlreadySaved) {
      showToast(`Saved "${title}" to your profile!`);
    } else {
      showToast(`Removed "${title}" from saved`);
    }
  };

  // Event Detail Click
  const handleSelectEvent = (event: EventItem) => {
    sounds.playModalOpen();
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  // Initiate Booking from Event Detail (Enforces Authentication)
  const handleStartBooking = (event: EventItem, tier: TicketTier, quantity: number) => {
    if (!isAuthenticated) {
      setSelectedEvent(event);
      setCheckoutTier(tier);
      setCheckoutQuantity(quantity);
      showToast('Please sign in or create an account to book tickets.');
      openAuthWithPrompt(`Sign in or create an account to book tickets for "${event.title}".`, 'signin');
      return;
    }
    setSelectedEvent(event);
    setCheckoutTier(tier);
    setCheckoutQuantity(quantity);
    setIsDetailModalOpen(false);
    setIsCheckoutOpen(true);
  };

  // On Complete Checkout
  const handleBookingSuccess = (newBooking: Booking) => {
    sounds.playSuccess();
    setUser(prev => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings],
    }));

    setIsCheckoutOpen(false);
    setActivePass(newBooking);
    setIsPassModalOpen(true);
    showToast(`Order confirmed! Your QR e-ticket is ready.`);
  };

  // Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    setUser(prev => ({
      ...prev,
      bookings: prev.bookings.filter(b => b.id !== bookingId),
    }));
    showToast('Reservation cancelled');
  };

  // Remove Saved Event from Profile
  const handleRemoveSaved = (eventId: string) => {
    setUser(prev => ({
      ...prev,
      savedEventIds: prev.savedEventIds.filter(id => id !== eventId),
    }));
    showToast('Removed from saved');
  };

  // DELETE EVENT HANDLER (AUTHENTICATED ONLY - CREATOR ONLY OR ADMIN)
  const handleDeleteEvent = (eventId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!isAuthenticated || !user) {
      showToast('Please sign in to delete events.');
      setIsAuthModalOpen(true);
      return;
    }

    const eventToDelete = events.find(ev => ev.id === eventId);
    if (!eventToDelete) return;

    // Strict ownership verification:
    // Admin can delete any event across the entire platform.
    // Regular authenticated user can ONLY delete events created by the user itself!
    const isAdmin = user.role === 'admin';
    const isOwner = Boolean(eventToDelete.createdByUserId) && eventToDelete.createdByUserId === user.id;

    if (!isAdmin && !isOwner) {
      showToast('Authenticated users can only delete events that they created themselves.');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${eventToDelete.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    setEvents(prev => prev.filter(ev => ev.id !== eventId));

    // Remove from user's saved events if present
    setUser(prev => ({
      ...prev,
      savedEventIds: prev.savedEventIds.filter(id => id !== eventId),
    }));

    showToast(`Deleted "${eventToDelete.title}"`);

    if (selectedEvent?.id === eventId) {
      setIsDetailModalOpen(false);
      setSelectedEvent(null);
    }
  };

  // ADD EVENT HANDLER (AUTHENTICATED ONLY)
  const handleAddEvent = (newEvent: EventItem) => {
    if (!isAuthenticated) {
      showToast('Please sign in to host events.');
      setIsAuthModalOpen(true);
      return;
    }

    setEvents(prev => [newEvent, ...prev]);
    sounds.playSuccess();
    showToast(`"${newEvent.title}" has been published!`);
  };

  // Open Host Modal (checks authentication first)
  const handleTriggerHostModal = () => {
    if (!isAuthenticated) {
      showToast('Please sign in or create an account to host an event.');
      openAuthWithPrompt('Sign in or create an account to host and publish events.', 'signin');
      return;
    }
    setIsHostModalOpen(true);
  };

  // Open profile with specific tab
  const handleOpenProfile = (tab: 'tickets' | 'saved' | 'settings' | 'hosted' = 'tickets') => {
    if (!isAuthenticated) {
      showToast(`Please sign in or create an account to view your ${tab === 'saved' ? 'saved events' : 'tickets & profile'}.`);
      openAuthWithPrompt(`Sign in or create an account to access your ${tab === 'saved' ? 'saved events' : 'tickets and profile'}.`, 'signin');
      return;
    }
    setProfileInitialTab(tab);
    setIsProfileOpen(true);
  };

  // Sign out (Returns to Guest user mode)
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUser(GUEST_USER);
    setCheckoutTier(null);
    try {
      localStorage.setItem('evento_auth', JSON.stringify(false));
      localStorage.setItem('evento_user_v2', JSON.stringify(GUEST_USER));
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out. Viewing platform as Guest user.');
  };

  // Switch to Guest Mode
  const handleSelectGuest = () => {
    setIsAuthenticated(false);
    setUser(GUEST_USER);
    showToast('Browsing as Guest user.');
  };

  // Sign in success
  const handleLoginSuccess = (authUser: UserProfile) => {
    sounds.playSuccess();
    setUser(authUser);
    setIsAuthenticated(true);
    setAuthActivityPrompt(null);
    showToast(`Welcome ${authUser.name}! Signed in as ${authUser.role === 'admin' ? 'Super Admin' : 'User'}.`);

    // If user was booking tickets before sign-in, seamlessly resume checkout
    if (selectedEvent && checkoutTier) {
      setIsCheckoutOpen(true);
    }
  };

  // Scroll to Trending
  const handleNavigateTrending = () => {
    const el = document.getElementById('trending-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Change city / district handler with tactile click sound
  const handleSelectCity = (city: string) => {
    sounds.playClick();
    setCurrentCity(city);
    showToast(`Location set to ${city}`);
  };

  // Filter events count for current location
  const isAllKerala = currentCity.toLowerCase() === 'all kerala';
  const eventsInCurrentCity = isAllKerala 
    ? events 
    : events.filter(e => e.city.toLowerCase() === currentCity.toLowerCase());
  const culturalInCurrentCity = eventsInCurrentCity.filter(e => e.category === 'cultural');

  return (
    <div className="relative min-h-screen bg-white text-slate-900 dark:bg-[#090d16] dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Ambient Fluid Liquid Glass Background */}
      <LiquidGlassBackground />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-4 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Unique Scroll Experience: Kerala Gradient Progress Bar & Floating Quick Dock */}
      <ScrollExperience
        currentCity={currentCity}
        onOpenCityPicker={() => setIsCityPickerOpen(true)}
        onNavigateTrending={handleNavigateTrending}
      />

      {/* 1. Header (Matching screenshot 3-zone contract, with auth toggle) */}
      <Header
        currentCity={currentCity}
        onOpenCityPicker={() => setIsCityPickerOpen(true)}
        onOpenCalendar={() => setIsCalendarOpen(true)}
        onOpenProfile={handleOpenProfile}
        onOpenHostModal={handleTriggerHostModal}
        savedCount={user.savedEventIds.length}
        ticketsCount={user.bookings.length}
        user={user}
        isAuthenticated={isAuthenticated}
        onOpenAuthModal={(mode = 'signin') => openAuthWithPrompt('Sign in with your username/gmail and password, or create a new account.', mode)}
        onSignOut={handleSignOut}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateHome={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTrending={handleNavigateTrending}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Location Showcase Hero Banner (Displays according to current selected location) */}
        <CityHeroBanner
          currentCity={currentCity}
          onSelectCity={handleSelectCity}
          onOpenCityModal={() => setIsCityPickerOpen(true)}
          eventCount={eventsInCurrentCity.length}
          culturalCount={culturalInCurrentCity.length}
        />

        {/* 2. Featured in [City] (Exact 4 tall portrait cards layout) */}
        <FeaturedEvents
          events={events}
          currentCity={currentCity}
          savedEventIds={user.savedEventIds}
          isAuthenticated={isAuthenticated}
          user={user}
          onToggleSave={handleToggleSave}
          onSelectEvent={handleSelectEvent}
          onDeleteEvent={handleDeleteEvent}
          onChangeCity={() => setIsCityPickerOpen(true)}
        />

        {/* 3. Browse by Category (Exact 6 cards layout including Cultural) */}
        <CategoryBrowser
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 4. Trending Events (Delete button only visible to event creators) */}
        <TrendingEvents
          events={events}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          savedEventIds={user.savedEventIds}
          isAuthenticated={isAuthenticated}
          user={user}
          currentCity={currentCity}
          onChangeCity={handleSelectCity}
          onToggleSave={handleToggleSave}
          onSelectEvent={handleSelectEvent}
          onDeleteEvent={handleDeleteEvent}
          onClearFilters={() => {
            setSelectedCategory('all');
            setSearchQuery('');
          }}
        />

        {/* 5. Host Your Own Event Callout Banner */}
        <HostEventCallout
          isAuthenticated={isAuthenticated}
          onOpenHostModal={handleTriggerHostModal}
          onOpenAuthModal={(mode = 'signin') => openAuthWithPrompt('Sign in or create an account to host your own events.', mode)}
        />

      </main>

      {/* 6. Footer (Exact match from screenshot) */}
      <Footer />

      {/* MODAL 1: Event Details & Rating (Delete button only visible to event creator) */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isSaved={selectedEvent ? user.savedEventIds.includes(selectedEvent.id) : false}
        isAuthenticated={isAuthenticated}
        user={user}
        onToggleSave={handleToggleSave}
        onBookEvent={handleStartBooking}
        onDeleteEvent={handleDeleteEvent}
        onPromptAuth={openAuthWithPrompt}
      />

      {/* MODAL 2: Ticket Booking & Payment Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        event={selectedEvent}
        selectedTier={checkoutTier}
        quantity={checkoutQuantity}
        user={user}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* MODAL 3: E-Ticket Pass with QR Code */}
      <TicketPassModal
        booking={activePass}
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        onGoToMyTickets={() => {
          setIsPassModalOpen(false);
          handleOpenProfile('tickets');
        }}
      />

      {/* MODAL 4: User Profile & Past Purchases / Saved Events / Hosted Events */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        initialTab={profileInitialTab}
        user={user}
        isAuthenticated={isAuthenticated}
        events={events}
        onUpdateUser={(updated) => setUser(prev => ({ ...prev, ...updated }))}
        onViewBookingPass={(b) => {
          setIsProfileOpen(false);
          setActivePass(b);
          setIsPassModalOpen(true);
        }}
        onCancelBooking={handleCancelBooking}
        onSelectEvent={handleSelectEvent}
        onRemoveSaved={handleRemoveSaved}
        onDeleteEvent={handleDeleteEvent}
        onOpenHostModal={handleTriggerHostModal}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onNavigateTrending={handleNavigateTrending}
      />

      {/* MODAL 5: Location / City Picker */}
      <LocationPickerModal
        isOpen={isCityPickerOpen}
        onClose={() => setIsCityPickerOpen(false)}
        currentCity={currentCity}
        onSelectCity={handleSelectCity}
      />

      {/* MODAL 6: Calendar Date Picker */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        events={events}
        onSelectEvent={handleSelectEvent}
      />

      {/* MODAL 7: Host Event Creator (Only for authenticated users) */}
      <HostEventModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        currentCity={currentCity}
        user={user}
        onAddEvent={handleAddEvent}
      />

      {/* MODAL 8: Authentication Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSelectGuest={handleSelectGuest}
        defaultEmail={user.email}
        activityPrompt={authActivityPrompt}
        initialMode={authInitialMode}
      />

    </div>
  );
}
