import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Calendar, 
  MapPin, 
  Clock, 
  Tag, 
  DollarSign, 
  Sparkles, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { EventItem, EventCategory, TicketTier, UserProfile } from '../types';

interface HostEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  user: UserProfile | null;
  onAddEvent: (event: EventItem) => void;
}

export const HostEventModal: React.FC<HostEventModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  user,
  onAddEvent,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('meetups');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(currentCity || 'Kochi');
  const [date, setDate] = useState('2026-10-30');
  const [time, setTime] = useState('18:00 - 21:00');
  const [priceType, setPriceType] = useState<'free' | 'paid'>('paid');
  const [price, setPrice] = useState('499');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [success, setSuccess] = useState(false);

  // Curated presets for easy testing in Kerala
  const sampleImages: { label: string; url: string }[] = [
    { label: 'Cultural / Kathakali', url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80' },
    { label: 'Theyyam / Temple Arts', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80' },
    { label: 'Snake Boat / Backwaters', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80' },
    { label: 'Music Concert', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80' },
    { label: 'Kerala Sunset Social', url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80' },
    { label: 'Football / Sevens', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80' },
    { label: 'Tech & Startup', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80' },
    { label: 'Food & Malabar Feast', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) return;

    const numericPrice = priceType === 'free' ? 0 : parseFloat(price) || 0;
    const finalImage = imageUrl.trim() || sampleImages[1].url;

    const [yyyy, mm, dd] = date.split('-');
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthName = months[parseInt(mm, 10) - 1] || 'OCT';
    const displayDate = `${dd} ${monthName} · ${time.split(' - ')[0] || '19:00'}`;

    const tickets: TicketTier[] = [
      {
        id: `t-host-${Date.now()}-ga`,
        name: priceType === 'free' ? 'Free RSVP Pass' : 'General Admission',
        price: numericPrice,
        description: 'Standard event entry with digital QR pass.',
        available: 100,
        perks: ['Event entry pass', 'Organizer check-in', 'Digital receipt'],
      },
    ];

    const newEvent: EventItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      city,
      venue: venue.trim(),
      address: address.trim() || `${venue.trim()}, ${city}`,
      date,
      displayDate,
      time,
      price: numericPrice,
      displayPrice: numericPrice === 0 ? 'Free' : `₹${numericPrice}`,
      image: finalImage,
      fallbackGradient: 'from-indigo-900 to-slate-900',
      description: description.trim() || 'Join us for this exciting community event with fellow enthusiasts.',
      longDescription: description.trim() || 'Join us for this exciting community event with fellow enthusiasts. Connect with peers, enjoy great hospitality, and participate in lively sessions.',
      featured: false,
      trending: true,
      rating: 5.0,
      reviewsCount: 1,
      organizer: {
        name: user?.name ? `${user.name} (Host)` : 'You (Host)',
        verified: true,
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        eventsHosted: 1,
      },
      tickets,
      reviews: [],
      tags: [category, city, 'Community'],
      attendeesCount: 1,
      coordinates: city === 'Trivandrum' ? { lat: 8.5241, lng: 76.9366 }
        : city === 'Calicut' ? { lat: 11.2588, lng: 75.7804 }
        : city === 'Thrissur' ? { lat: 10.5276, lng: 76.2144 }
        : city === 'Bangalore' ? { lat: 12.9716, lng: 77.5946 }
        : city === 'Goa' ? { lat: 15.2993, lng: 74.1240 }
        : { lat: 9.9312, lng: 76.2673 },
      createdByUserId: user?.id || 'usr-sooraj-9495',
    };

    setSuccess(true);
    setTimeout(() => {
      onAddEvent(newEvent);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl liquid-glass rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Host Your Own Event</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Fort Kochi Indie Music & Art Jam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500"
              >
                <option value="cultural">Cultural & Traditional Festivals</option>
                <option value="music">Music & Acoustic Jams</option>
                <option value="football">Football / Sevens Sports</option>
                <option value="concerts">Live Concerts & Gigs</option>
                <option value="meetups">Meetups & Social</option>
                <option value="company-collab">Company Collaboration & Tech</option>
                <option value="art">Art & Exhibitions</option>
                <option value="food">Food & Culinary Festivals</option>
                <option value="wellness">Wellness & Ayurveda</option>
                <option value="comedy">Stand-Up Comedy</option>
                <option value="workshop">Workshops & Masterclasses</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Kerala District / City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500"
              >
                <option value="Kochi">Kochi</option>
                <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                <option value="Kozhikode">Kozhikode</option>
                <option value="Thrissur">Thrissur</option>
                <option value="Kannur">Kannur</option>
                <option value="Alappuzha">Alappuzha</option>
                <option value="Wayanad">Wayanad</option>
                <option value="Kottayam">Kottayam</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Venue Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bolgatty Palace Grounds, Kochi"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Street Address</label>
              <input
                type="text"
                placeholder="e.g. Marine Drive, Ernakulam, Kochi 682031"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Range</label>
              <input
                type="text"
                required
                placeholder="e.g. 19:00 - 22:30"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Ticket Price</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  checked={priceType === 'paid'}
                  onChange={() => setPriceType('paid')}
                  className="text-indigo-600"
                />
                <span>Paid Event (₹)</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  checked={priceType === 'free'}
                  onChange={() => setPriceType('free')}
                  className="text-indigo-600"
                />
                <span>Free Admission</span>
              </label>
            </div>
            {priceType === 'paid' && (
              <div className="pt-1">
                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cover photo presets */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Cover Image</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {sampleImages.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(s.url)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                    imageUrl === s.url
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="Or paste an image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Event Description</label>
            <textarea
              rows={3}
              placeholder="What will attendees experience? Special guests, lineup, schedule, dress code..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={success}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Event Published!</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Event to Live Feed</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
