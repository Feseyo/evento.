import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Check, 
  Search, 
  Loader2, 
  Globe 
} from 'lucide-react';
import { CITIES } from '../data/mockEvents';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  onSelectCity: (city: string) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
}) => {
  const [search, setSearch] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [detectedSuccess, setDetectedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCities = CITIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleDetectLocation = () => {
    setDetecting(true);
    setDetectedSuccess(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setDetecting(false);
          setDetectedSuccess('Nearby events in Kochi, Kerala detected');
          onSelectCity('Kochi');
          setTimeout(() => {
            onClose();
          }, 800);
        },
        () => {
          // Fallback if denied
          setDetecting(false);
          setDetectedSuccess('Location detected: Kochi, Kerala');
          onSelectCity('Kochi');
          setTimeout(() => {
            onClose();
          }, 800);
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        setDetecting(false);
        setDetectedSuccess('Location set to Kochi, Kerala');
        onSelectCity('Kochi');
        setTimeout(() => {
          onClose();
        }, 800);
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md liquid-glass rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Select Location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {/* Current location button */}
          <button
            onClick={handleDetectLocation}
            disabled={detecting}
            className="w-full p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/60 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold text-xs flex items-center justify-between transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Navigation className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Use My Current Location</span>
            </div>
            {detecting ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            ) : detectedSuccess ? (
              <span className="text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">✓ Active</span>
            ) : (
              <span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-normal">GPS</span>
            )}
          </button>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search district, city or region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* City list */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto pt-1">
            {filteredCities.map((c) => {
              const isSelected = c.name.toLowerCase() === currentCity.toLowerCase();

              return (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCity(c.name);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-2xs">
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0.5 right-0.5 text-xs drop-shadow-sm">{c.flag}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold block truncate">{c.name}</span>
                        {c.malayalam && (
                          <span className={`text-[10px] font-medium shrink-0 ${isSelected ? 'text-indigo-200' : 'text-amber-700 dark:text-amber-400'}`}>
                            {c.malayalam}
                          </span>
                        )}
                      </div>
                      <span className={`text-[11px] line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {c.tagline}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
