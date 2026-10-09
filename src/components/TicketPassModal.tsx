import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Clock, 
  Download, 
  Share2, 
  QrCode, 
  Ticket,
  ArrowRight
} from 'lucide-react';
import { Booking } from '../types';

interface TicketPassModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToMyTickets: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  booking,
  isOpen,
  onClose,
  onGoToMyTickets,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !booking) return null;

  const handleDownload = () => {
    // Generate text/ics download or trigger receipt download feedback
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(booking.eventTitle);
    const details = encodeURIComponent(`Booking ID: ${booking.id}\nVenue: ${booking.eventVenue}`);
    const location = encodeURIComponent(`${booking.eventVenue}, ${booking.eventCity}`);
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(gCalUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Pass Container */}
      <div className="relative w-full max-w-md liquid-glass rounded-3xl shadow-2xl overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Celebration Banner */}
        <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-sm font-bold tracking-tight">Booking Confirmed!</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-emerald-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digital Ticket Pass Body */}
        <div className="p-6 space-y-6">
          
          {/* Ticket Header & Image */}
          <div className="flex gap-4 items-center">
            <img
              src={booking.eventImage}
              alt={booking.eventTitle}
              className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded">
                {booking.ticketTierName}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate mt-1">
                {booking.eventTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{booking.eventVenue}</span>
              </p>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block uppercase">Date</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{booking.eventDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block uppercase">Time</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{booking.eventTime}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block uppercase">Attendee</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{booking.attendeeName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block uppercase">Tickets</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{booking.quantity} Pass{booking.quantity > 1 ? 'es' : ''}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block uppercase">Booking Reference</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">{booking.id}</span>
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                {booking.totalPaid === 0 ? 'Free' : `Paid ₹${booking.totalPaid}`}
              </span>
            </div>
          </div>

          {/* Simulated Ticket Tear / Serration */}
          <div className="relative flex items-center justify-between my-2 -mx-6">
            <div className="w-4 h-8 bg-slate-900/60 rounded-r-full" />
            <div className="border-b-2 border-dashed border-slate-200 dark:border-slate-700 flex-1 mx-2" />
            <div className="w-4 h-8 bg-slate-900/60 rounded-l-full" />
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border border-slate-200 mb-2 flex items-center justify-center">
              <img
                src={booking.qrCodeUrl}
                alt="Ticket QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider font-mono">
              {booking.id}
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
              Present this QR code on arrival for admission
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleAddToCalendar}
              className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Add to Calendar</span>
            </button>
            <button
              onClick={handleDownload}
              className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Save Pass'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onGoToMyTickets();
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View All My Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
