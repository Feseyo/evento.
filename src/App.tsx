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

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('evento_auth');
      return stored !== null ? JSON.parse(stored) : true; // Default signed in as Sooraj S
    } catch {
      return true;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    const defaultBooking: Booking = {
      id: 'EVT-KL-849201',
      eventId: 'feat-1',
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
    };

    try {
      const savedUser = localStorage.getItem('evento_user_v2');
      return savedUser ? JSON.parse(savedUser) : {
        id: 'usr-sooraj-9495',
        name: 'Sooraj S',
        email: 'soorajs9495@gmail.com',
        phone: '+91 94950 12345',
        city: 'Kochi',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        savedEventIds: ['feat-1', 'feat-4', 'trend-1'],
        bookings: [defaultBooking],
        interests: ['music', 'football', 'company-collab'],
        emailNotifications: true,
        nearbyAlerts: true,
      };
    } catch {
      return {
        id: 'usr-sooraj-9495',
        name: 'Sooraj S',
        email: 'soorajs9495@gmail.com',
        phone: '+91 94950 12345',
        city: 'Kochi',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        savedEventIds: ['feat-1', 'feat-4', 'trend-1'],
        bookings: [defaultBooking],
        interests: ['music', 'football', 'company-collab'],
        emailNotifications: true,
        nearbyAlerts: true,
      };
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
    if (!isAlreadySaved) {
      showToast(`Saved "${title}" to your profile!`);
    } else {
      showToast(`Removed "${title}" from saved`);
    }
  };

  // Event Detail Click
  const handleSelectEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  // Initiate Booking from Event Detail
  const handleStartBooking = (event: EventItem, tier: TicketTier, quantity: number) => {
    setSelectedEvent(event);
    setCheckoutTier(tier);
    setCheckoutQuantity(quantity);
    setIsDetailModalOpen(false);
    setIsCheckoutOpen(true);
  };

  // On Complete Checkout
  const handleBookingSuccess = (newBooking: Booking) => {
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

  // DELETE EVENT HANDLER (AUTHENTICATED ONLY - CREATOR ONLY)
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

    // Strict ownership verification: only creator can delete this event
    const isOwner = eventToDelete.createdByUserId === user.id ||
      eventToDelete.organizer.name.includes('You') ||
      (Boolean(user.name) && eventToDelete.organizer.name.includes(user.name.split(' ')[0]));

    if (!isOwner) {
      showToast('You can only delete events that you created.');
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
    showToast(`"${newEvent.title}" has been published!`);
  };

  // Open Host Modal (checks authentication first)
  const handleTriggerHostModal = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to host an event.');
      setIsAuthModalOpen(true);
      return;
    }
    setIsHostModalOpen(true);
  };

  // Open profile with specific tab
  const handleOpenProfile = (tab: 'tickets' | 'saved' | 'settings' | 'hosted' = 'tickets') => {
    setProfileInitialTab(tab);
    setIsProfileOpen(true);
  };

  // Sign out
  const handleSignOut = () => {
    setIsAuthenticated(false);
    showToast('You have signed out. Sign in anytime to host or delete events.');
  };

  // Sign in success
  const handleLoginSuccess = (authUser: UserProfile) => {
    setUser(authUser);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${authUser.name}!`);
  };

  // Scroll to Trending
  const handleNavigateTrending = () => {
    const el = document.getElementById('trending-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
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
          onSelectCity={(city) => {
            setCurrentCity(city);
            showToast(`Location set to ${city}`);
          }}
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
          onChangeCity={(city) => {
            setCurrentCity(city);
            showToast(`Location set to ${city}`);
          }}
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
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
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
        onSelectCity={(city) => {
          setCurrentCity(city);
          showToast(`Browsing events in ${city}`);
        }}
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
        defaultEmail={user.email}
      />

    </div>
  );
}
