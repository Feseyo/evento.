import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Bookmark, 
  Ticket, 
  Search, 
  PlusCircle, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  Settings,
  Sun,
  Moon,
  Volume2,
  VolumeX
} from 'lucide-react';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  currentCity: string;
  onOpenCityPicker: () => void;
  onOpenCalendar: () => void;
  onOpenProfile: (tab?: 'tickets' | 'saved' | 'settings' | 'hosted') => void;
  onOpenHostModal: () => void;
  savedCount: number;
  ticketsCount: number;
  user: UserProfile | null;
  isAuthenticated: boolean;
  onOpenAuthModal: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateHome: () => void;
  onNavigateTrending: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onOpenCityPicker,
  onOpenCalendar,
  onOpenProfile,
  onOpenHostModal,
  savedCount,
  ticketsCount,
  user,
  isAuthenticated,
  onOpenAuthModal,
  onSignOut,
  searchQuery,
  onSearchChange,
  onNavigateHome,
  onNavigateTrending,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { theme, isDark, toggleTheme, soundEnabled, toggleSound } = useTheme();

  return (
    <header className="sticky top-0 z-40 liquid-glass border-b transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ZONE 1: BRAND LOGO */}
          <div className="flex items-center gap-6">
            <button 
              onClick={onNavigateHome}
              className="group text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg cursor-pointer"
            >
              <span>EVENTO</span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
            </button>

            {/* LOCATION SELECTOR */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCityPicker();
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-pill hover:scale-105 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all group shadow-2xs cursor-pointer"
              title="Change your current city"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="max-w-[120px] truncate">{currentCity}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            </button>
          </div>

          {/* ZONE 2: PRIMARY NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCityPicker();
              }}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Cities
            </button>
            <button
              onClick={onNavigateTrending}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Trending
            </button>
            <button
              onClick={onOpenCalendar}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-slate-400 dark:text-slate-400" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => onOpenProfile('saved')}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-slate-400 dark:text-slate-400" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full tabular-nums">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* ZONE 3: PRIMARY ACTIONS, THEME SWITCHER & USER AUTH */}
          <div className="flex items-center gap-3">
            {/* Quick search input */}
            <div className="relative hidden sm:block w-40 xl:w-52">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events, venues..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-7 py-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-800 rounded-full outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* LIGHT / DARK MODE TOGGLE (PROMINENT, INSTANT SWITCH WITH SOUND) */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs group focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-100 hover:bg-slate-200 border-slate-200/90 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-200"
              title={isDark ? "Switch to Light Mode (sound enabled)" : "Switch to Dark Mode (sound enabled)"}
              aria-label="Toggle dark and light mode"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                  <span className="hidden sm:inline font-bold text-amber-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform" />
                  <span className="hidden sm:inline font-bold text-indigo-700">Dark</span>
                </>
              )}
            </button>

            {/* SOUND EFFECT TOGGLE */}
            <button
              onClick={toggleSound}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs group focus:outline-none bg-slate-100 hover:bg-slate-200 border-slate-200/90 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-300"
              title={soundEnabled ? "Sound effects active (Click to mute)" : "Sound effects muted (Click to unmute)"}
              aria-label="Toggle sound effects"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* MY PROFILE & AUTH CONTROLS (FOR ALL DEVICE SIZES) */}
            {!isAuthenticated ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenAuthModal('signin');
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs hover:shadow transition-all group cursor-pointer"
              >
                <span>Sign In</span>
              </button>
            ) : (
              /* AUTHENTICATED USER: MY PROFILE PILL & DROPDOWN */
              <div className="relative">
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-2xs overflow-hidden">
                  <button
                    onClick={() => onOpenProfile('tickets')}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer group"
                    title="Open My Profile (View Tickets, Host Event, Saved)"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt={user?.name || 'User'}
                      className="w-5 h-5 rounded-full object-cover border border-indigo-200 dark:border-indigo-800"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold max-w-[85px] sm:max-w-[110px] truncate">
                        {user?.name || 'My Profile'}
                      </span>
                      {user?.role === 'admin' ? (
                        <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-rose-600 text-white rounded-md tracking-wider">
                          Admin
                        </span>
                      ) : (
                        <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-md">
                          User
                        </span>
                      )}
                      {ticketsCount > 0 && (
                        <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full tabular-nums">
                          {ticketsCount}
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-label="Toggle profile menu"
                    className="px-2 py-2 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-l border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 liquid-glass rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          user?.role === 'admin' 
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300' 
                            : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                        }`}>
                          {user?.role === 'admin' ? 'Super Admin' : 'Login User'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        onOpenProfile('tickets');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Open My Profile</span>
                      </div>
                      <span className="text-[10px] text-indigo-500">View All</span>
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />

                    <button
                      onClick={() => {
                        onOpenProfile('tickets');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Ticket className="w-4 h-4 text-emerald-500" />
                        <span>View Tickets</span>
                      </div>
                      {ticketsCount > 0 && (
                        <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full tabular-nums">
                          {ticketsCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        onOpenHostModal();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Host Event</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenProfile('hosted');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>My Hosted Events</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenProfile('saved');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bookmark className="w-4 h-4 text-slate-400" />
                        <span>Saved Events</span>
                      </div>
                      {savedCount > 0 && (
                        <span className="px-1.5 py-0.2 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full tabular-nums">
                          {savedCount}
                        </span>
                      )}
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        onSignOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile quick profile icon button (visible on mobile alongside hamburger) */}
            <button
              onClick={() => onOpenProfile('tickets')}
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 relative cursor-pointer"
              title="My Profile (Tickets, Host Event)"
              aria-label="My Profile"
            >
              {isAuthenticated ? (
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                  alt={user?.name || 'User'}
                  className="w-5 h-5 rounded-full object-cover border border-indigo-400"
                />
              ) : (
                <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              )}
              {ticketsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {ticketsCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg lg:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 sm:hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search music, football, tech, culture..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 dark:border-slate-800 liquid-glass px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            
            {/* 1. MOBILE USER PROFILE CARD (ONLY FOR AUTHENTICATED USERS) */}
            {isAuthenticated && (
              <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt={user?.name || 'User'}
                      className="w-9 h-9 rounded-full object-cover border border-indigo-400 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          user?.role === 'admin'
                            ? 'bg-rose-600 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}>
                          {user?.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile('tickets');
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors shrink-0 cursor-pointer"
                  >
                    My Profile
                  </button>
                </div>

                {/* Quick Actions inside My Profile on Mobile: View Tickets & Host Event */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile('tickets');
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800/90 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">View Tickets</span>
                    {ticketsCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full tabular-nums">
                        {ticketsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenHostModal();
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800/90 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="truncate">Host Event</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
            >
              <span className="flex items-center gap-2">
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                <span>Appearance Mode</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-amber-300">
                {isDark ? 'Dark Mode (Dark BG)' : 'Light Mode (White BG)'}
              </span>
            </button>

            {/* Mobile Sound Effects Switcher */}
            <button
              onClick={toggleSound}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
            >
              <span className="flex items-center gap-2">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>Sound Effects</span>
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${soundEnabled ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                {soundEnabled ? 'Enabled' : 'Muted'}
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenCityPicker();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Selected City</span>
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                {currentCity}
              </span>
            </button>

            <button
              onClick={() => {
                onNavigateTrending();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
            >
              <span>Trending Events</span>
            </button>

            <button
              onClick={() => {
                onOpenCalendar();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
            >
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span>Event Calendar</span>
            </button>

            <button
              onClick={() => {
                onOpenProfile('saved');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
            >
              <span className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-slate-400" />
                <span>Saved Events</span>
              </span>
              {savedCount > 0 && (
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenAuthModal('signin');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs text-center transition-colors cursor-pointer"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
