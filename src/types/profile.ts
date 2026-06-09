export interface BusinessProfile {
  businessName: string;
  ownerName: string;
  description: string;
  yearsExperience: number;
}

export interface KitchenDetails {
  kitchenType: string; // e.g. Home Kitchen
  specialties: string[]; // Gujarati, Jain...
  fssaiNumber: string;
  address: string;
}

export interface ContactDetails {
  phone: string;
  email: string;
  alternatePhone: string;
}

export interface DeliveryDetails {
  radiusKm: number;
  minOrderAmount: number;
  freeDeliveryThreshold: number;
  areas: string[];
}

export interface TimeSlot {
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface DailySchedule {
  lunch: TimeSlot;
  dinner: TimeSlot;
  isClosed: boolean;
}

export interface OperatingHours {
  mondayFriday: DailySchedule;
  saturday: DailySchedule;
  sunday: DailySchedule;
}

export interface NotificationToggles {
  newOrders: boolean;
  subscriptionRenewals: boolean;
  deliveryReminders: boolean;
  customerMessages: boolean;
  weeklyReports: boolean;
  marketingUpdates: boolean;
}

export interface InsightsSnapshot {
  totalCustomers: number;
  activePlans: number;
  rating: number;
  monthlyRevenue: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SupportLink {
  title: string;
  description: string;
  label: string;
}

export interface VendorProfile {
  businessName: string;
  ownerName: string;
  description: string;
  experience: number;
  phone: string;
  email: string;
}
