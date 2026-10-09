import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Tag, 
  Lock, 
  Ticket, 
  Calendar, 
  MapPin, 
  Loader2,
  Sparkles,
  Smartphone,
  QrCode,
  Building2
} from 'lucide-react';
import { EventItem, TicketTier, Booking, UserProfile } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  selectedTier: TicketTier | null;
  quantity: number;
  user: UserProfile | null;
  onBookingSuccess: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  event,
  selectedTier,
  quantity,
  user,
  onBookingSuccess,
}) => {
  const [attendeeName, setAttendeeName] = useState(user?.name || 'Sooraj S');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email || 'soorajs9495@gmail.com');
  const [attendeePhone, setAttendeePhone] = useState(user?.phone || '+91 94950 12345');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  
  // UPI state
  const [upiId, setUpiId] = useState('sooraj@okhdfcbank');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');

  // Card form state
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Net banking bank
  const [selectedBank, setSelectedBank] = useState('Federal Bank');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Submission state
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !event || !selectedTier) return null;

  const isFree = selectedTier.price === 0;
  const subtotal = selectedTier.price * quantity;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const bookingFee = isFree ? 0 : 30; // ₹30 GST/handling
  const finalTotal = Math.max(0, subtotal - discountAmount + bookingFee);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'KERALA2026' || code === 'EVENTO10' || code === 'KOCHI') {
      setDiscountPercent(15);
      setPromoMessage('Promo code applied: 15% discount!');
    } else {
      setPromoMessage('Invalid promo code. Try "KERALA2026"');
    }
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const bookingId = `EVT-KL-${Math.floor(100000 + Math.random() * 900000)}`;
      
      let payMethodLabel = 'Free Registration';
      if (!isFree) {
        if (paymentMethod === 'upi') {
          payMethodLabel = `UPI (${selectedUpiApp.toUpperCase()} - ${upiId})`;
        } else if (paymentMethod === 'card') {
          payMethodLabel = 'RuPay / Card •••• 4242';
        } else {
          payMethodLabel = `Net Banking (${selectedBank})`;
        }
      }

      const newBooking: Booking = {
        id: bookingId,
        eventId: event.id,
        eventTitle: event.title,
        eventImage: event.image,
        eventDate: event.displayDate,
        eventTime: event.time,
        eventVenue: event.venue,
        eventCity: event.city,
        ticketTierName: selectedTier.name,
        quantity,
        totalPaid: finalTotal,
        bookingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        attendeeName: attendeeName || 'Guest Attendee',
        attendeeEmail: attendeeEmail || 'guest@example.com',
        attendeePhone,
        paymentMethod: payMethodLabel,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`EVENTO-PASS-${bookingId}`)}`,
        status: 'confirmed',
      };

      onBookingSuccess(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl liquid-glass rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Secure Indian Checkout</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant UPI & Card Settlement (INR ₹)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCompleteOrder} className="p-6 overflow-y-auto space-y-6 max-h-[80vh]">
          
          {/* Event Quick Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 flex items-center gap-4">
            <img
              src={event.image}
              alt={event.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{event.title}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{event.displayDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{event.venue}, {event.city}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-md">
                {selectedTier.name}
              </span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
                {quantity}x {isFree ? 'Free' : `₹${selectedTier.price}`}
              </div>
            </div>
          </div>

          {/* Section 1: Attendee Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              1. Attendee Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="e.g. Sooraj S"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Email (for E-Ticket delivery)</label>
                <input
                  type="email"
                  required
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  placeholder="soorajs9495@gmail.com"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Mobile Phone (WhatsApp & SMS Pass link)</label>
                <input
                  type="tel"
                  required
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  placeholder="+91 94950 12345"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method (if not free) */}
          {!isFree && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Indian Payment Gateway
              </h4>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>RuPay / Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* UPI Tab */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('gpay')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        selectedUpiApp === 'gpay' ? 'bg-white dark:bg-slate-900 border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-2xs' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Google Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('phonepe')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        selectedUpiApp === 'phonepe' ? 'bg-white dark:bg-slate-900 border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-2xs' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      PhonePe
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('paytm')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        selectedUpiApp === 'paytm' ? 'bg-white dark:bg-slate-900 border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-2xs' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Paytm
                    </button>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Enter UPI ID / VPA</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    A payment request of ₹{finalTotal} will be sent to your UPI app for instant PIN approval.
                  </p>
                </div>
              )}

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">RuPay / Visa / Mastercard Number</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• 4242"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">CVV</label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={cardCvc}
                          maxLength={4}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="888"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Net banking select */}
              {paymentMethod === 'netbanking' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">Select Indian Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none font-medium"
                  >
                    <option value="Federal Bank">Federal Bank (Kerala)</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="South Indian Bank">South Indian Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Canara Bank">Canara Bank</option>
                  </select>
                </div>
              )}

              {/* Promo Code Input */}
              <div className="pt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. KERALA2026)"
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] mt-1 font-semibold ${discountPercent > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {promoMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Price Breakdown (INR) */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Tickets ({quantity}x ₹{selectedTier.price})</span>
              <span className="font-semibold tabular-nums text-slate-900 dark:text-white">₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Festive Discount ({discountPercent}%)</span>
                <span className="tabular-nums">-₹{discountAmount}</span>
              </div>
            )}
            {!isFree && (
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Platform Convenience Fee (GST incl.)</span>
                <span className="tabular-nums">₹{bookingFee}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-slate-900 dark:text-white font-extrabold text-sm">
              <span>Total Payable</span>
              <span className="text-base text-indigo-600 dark:text-indigo-400 tabular-nums">
                {isFree ? 'Free' : `₹${finalTotal}`}
              </span>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Genuine Tickets</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Instant QR Pass</span>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing UPI Payment...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isFree ? 'Confirm Free Registration' : `Pay ₹${finalTotal} & Get E-Ticket`}</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
