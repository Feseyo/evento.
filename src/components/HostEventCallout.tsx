import React, { useState } from 'react';
import { PlusCircle, Sparkles, Laptop, Lock, UserPlus } from 'lucide-react';
import { ScrollReveal } from './ScrollExperience';
import { sounds } from '../utils/soundEffects';

interface HostEventCalloutProps {
  isAuthenticated: boolean;
  onOpenHostModal: () => void;
  onOpenAuthModal: (mode?: 'signin' | 'signup') => void;
}

export const HostEventCallout: React.FC<HostEventCalloutProps> = ({ 
  isAuthenticated,
  onOpenHostModal,
  onOpenAuthModal 
}) => {
  const [imageError, setImageError] = useState(false);

  // High quality photo matching screenshot: person working at laptop with event dashboard in sunlit creative space
  const hostImageUrl = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80';

  return (
    <section id="host-callout-section" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Content Column */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Host your own event
                </h2>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                  Create an event in minutes and reach thousands of people looking for things to do across Kerala.
                </p>
                <div className="pt-2">
                  {isAuthenticated ? (
                    <button
                      onClick={onOpenHostModal}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      <span>Create Event</span>
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          onOpenAuthModal('signin');
                        }}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all group cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                        <span>Sign In to Host Event</span>
                      </button>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          onOpenAuthModal('signup');
                        }}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all group cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-indigo-200" />
                        <span>Create Account</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Image Column (Matches reference photo) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-800 bg-slate-900">
                  {imageError ? (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
                      <Laptop className="w-12 h-12 text-indigo-400 mb-2" />
                      <span className="text-sm font-bold">Event Host Studio</span>
                      <span className="text-xs text-slate-300 mt-1">Manage ticketing, guests & check-in</span>
                    </div>
                  ) : (
                    <img
                      src={hostImageUrl}
                      alt="Event host working on laptop"
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Subtle sheen */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none rounded-2xl" />
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
