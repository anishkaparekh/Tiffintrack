import { 
  BusinessProfile, 
  KitchenDetails, 
  ContactDetails, 
  DeliveryDetails, 
  OperatingHours, 
  NotificationToggles, 
  InsightsSnapshot,
  FAQItem,
  SupportLink,
  VendorProfile
} from '../types/profile';

export const mockBusinessProfile: BusinessProfile = {
  businessName: "Priya's Home Kitchen",
  ownerName: "Priya Shah",
  description: "Providing fresh, homemade Gujarati meals prepared with love and authentic flavors.",
  yearsExperience: 8
};

export const mockVendorProfile: VendorProfile = {
  businessName: "Priya's Home Kitchen",
  ownerName: "Priya Shah",
  description: "Providing fresh, homemade Gujarati meals prepared with love and authentic flavors.",
  experience: 8,
  phone: "+91 98765 43210",
  email: "priya@homekitchen.com"
};

export const mockKitchenDetails: KitchenDetails = {
  kitchenType: "Home Kitchen",
  specialties: ["Gujarati Cuisine", "Jain Meals", "Healthy Tiffins"],
  fssaiNumber: "12345678901234",
  address: "Satellite, Ahmedabad, Gujarat"
};

export const mockContactDetails: ContactDetails = {
  phone: "+91 98765 43210",
  email: "priya@homekitchen.com",
  alternatePhone: "+91 98765 01234"
};

export const mockDeliveryDetails: DeliveryDetails = {
  radiusKm: 10,
  minOrderAmount: 100,
  freeDeliveryThreshold: 500,
  areas: ["Satellite", "Prahlad Nagar", "Bopal", "Bodakdev", "SG Highway"]
};

export const mockOperatingHours: OperatingHours = {
  mondayFriday: {
    lunch: { openTime: "11:00 AM", closeTime: "02:00 PM", isClosed: false },
    dinner: { openTime: "06:00 PM", closeTime: "09:00 PM", isClosed: false },
    isClosed: false
  },
  saturday: {
    lunch: { openTime: "11:00 AM", closeTime: "02:00 PM", isClosed: false },
    dinner: { openTime: "", closeTime: "", isClosed: true },
    isClosed: false
  },
  sunday: {
    lunch: { openTime: "", closeTime: "", isClosed: true },
    dinner: { openTime: "", closeTime: "", isClosed: true },
    isClosed: true
  }
};

export const mockNotificationToggles: NotificationToggles = {
  newOrders: true,
  subscriptionRenewals: true,
  deliveryReminders: true,
  customerMessages: true,
  weeklyReports: false,
  marketingUpdates: false
};

export const mockInsightsSnapshot: InsightsSnapshot = {
  totalCustomers: 126,
  activePlans: 4,
  rating: 4.8,
  monthlyRevenue: 238700
};

export const mockFAQsList: FAQItem[] = [
  {
    question: "How do I pause a customer's subscription plan?",
    answer: "You can pause any subscription by navigating to the Customers list tab, clicking the action dots next to their name, and choosing 'Pause Sub'."
  },
  {
    question: "How do I edit my kitchen's delivery settings?",
    answer: "Under delivery settings on this profile tab, you can adjust your service radius, delivery locations list, and pricing structures."
  },
  {
    question: "Is there a limit to the number of menu items I can list?",
    answer: "No, TiffinTrack lets homemakers list unlimited active dishes, but we recommend maintaining 5-10 core options to optimize preparation."
  }
];

export const mockSupportLinks: SupportLink[] = [
  {
    title: "FAQ Center",
    description: "Read quick answers to common dashboard operations.",
    label: "Explore FAQs"
  },
  {
    title: "Support Hotline",
    description: "Direct chat line with our vendor onboarding assistants.",
    label: "Contact Support"
  },
  {
    title: "Homemaker Guidelines",
    description: "Best practices on hygiene, packaging, and deliveries.",
    label: "Read Guidelines"
  },
  {
    title: "Terms & Policies",
    description: "Legal guidelines on marketplace payouts and listings rules.",
    label: "View Policies"
  }
];
