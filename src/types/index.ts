export type EventCategory = 
  | 'music'
  | 'football'
  | 'concerts'
  | 'meetups'
  | 'company-collab'
  | 'cultural'
  | 'art'
  | 'food'
  | 'wellness'
  | 'comedy'
  | 'workshop';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
  perks: string[];
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  city: string;
  venue: string;
  address: string;
  date: string; // e.g. "2026-10-12"
  displayDate: string; // e.g. "12 OCT · 20:00"
  time: string;
  price: number; // 0 for free
  displayPrice: string; // e.g. "£45" or "Free"
  image: string;
  fallbackGradient: string;
  description: string;
  longDescription: string;
  featured: boolean;
  trending: boolean;
  rating: number;
  reviewsCount: number;
  organizer: {
    name: string;
    verified: boolean;
    avatar: string;
    eventsHosted: number;
  };
  tickets: TicketTier[];
  reviews: Review[];
  tags: string[];
  attendeesCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdByUserId?: string;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventCity: string;
  ticketTierName: string;
  quantity: number;
  totalPaid: number;
  bookingDate: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  paymentMethod: string;
  qrCodeUrl: string;
  status: 'confirmed' | 'cancelled' | 'attended';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  role: 'guest' | 'user' | 'admin';
  savedEventIds: string[];
  bookings: Booking[];
  interests: EventCategory[];
  emailNotifications: boolean;
  nearbyAlerts: boolean;
}

export interface CityInfo {
  id: string;
  name: string;
  malayalam: string;
  country: string;
  tagline: string;
  flag: string;
  image: string;
  bannerImage: string;
  lat: number;
  lng: number;
  popularSpots: string[];
  signatureCulture: string;
}
