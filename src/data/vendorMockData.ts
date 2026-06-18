import { 
  VendorProfile, 
  StatsCardData, 
  RevenueData, 
  Order, 
  Meal, 
  SubscriptionPlan, 
  ActivityFeedItem, 
  SystemNotification 
} from '../types/vendor';

export const mockProfile: VendorProfile = {
  name: 'Priya Shah',
  role: 'Home Kitchen Owner',
  initials: 'PS',
  businessLatitude: 22.3155,
  businessLongitude: 72.8625,
};

export const mockStats: StatsCardData[] = [
  {
    title: "Today's Orders",
    value: "48",
    changeText: "↑ 12% from yesterday",
    trend: "up",
    iconName: "ShoppingBag"
  },
  {
    title: "Active Customers",
    value: "126",
    changeText: "↑ 9 new this week",
    trend: "up",
    iconName: "Users"
  },
  {
    title: "Active Subscription Plans",
    value: "4",
    changeText: "All currently active",
    trend: "neutral",
    iconName: "Calendar"
  },
  {
    title: "Today's Revenue",
    value: "₹8,450",
    changeText: "↑ 18% compared to yesterday",
    trend: "up",
    iconName: "IndianRupee"
  }
];

export const mockRevenue: RevenueData = {
  daily: [
    { label: 'Mon', value: 6100 },
    { label: 'Tue', value: 7850 },
    { label: 'Wed', value: 8450 },
    { label: 'Thu', value: 7900 },
    { label: 'Fri', value: 9200 },
    { label: 'Sat', value: 10300 },
    { label: 'Sun', value: 8700 }
  ],
  weekly: [
    { label: 'Week 1', value: 48000 },
    { label: 'Week 2', value: 52000 },
    { label: 'Week 3', value: 50500 },
    { label: 'Week 4', value: 56800 }
  ],
  monthly: [
    { label: 'Jan', value: 182000 },
    { label: 'Feb', value: 195000 },
    { label: 'Mar', value: 208000 },
    { label: 'Apr', value: 215000 }
  ]
};

export const mockOrders: Order[] = [
  {
    id: "TT1024",
    customerName: "Rahul Mehta",
    plan: "Lunch Only",
    status: "preparing",
    deliveryTime: "12:30 PM"
  },
  {
    id: "TT1025",
    customerName: "Sneha Patel",
    plan: "Family Plan",
    status: "delivered",
    deliveryTime: "1:00 PM"
  },
  {
    id: "TT1026",
    customerName: "Karan Shah",
    plan: "Lunch + Dinner",
    status: "out_for_delivery",
    deliveryTime: "12:45 PM"
  },
  {
    id: "TT1027",
    customerName: "Neha Joshi",
    plan: "Custom Plan",
    status: "preparing",
    deliveryTime: "7:00 PM"
  },
  {
    id: "TT1028",
    customerName: "Dhruv Desai",
    plan: "Lunch Only",
    status: "delivered",
    deliveryTime: "1:15 PM"
  }
];

export const mockMeals: Meal[] = [
  {
    id: "M1",
    name: "Gujarati Thali",
    category: "Traditional",
    ordersThisWeek: 84,
    price: 140,
    status: "Available"
  },
  {
    id: "M2",
    name: "Jain Lunch Box",
    category: "Jain Special",
    ordersThisWeek: 52,
    price: 130,
    status: "Available"
  },
  {
    id: "M3",
    name: "Paneer Combo",
    category: "North Indian",
    ordersThisWeek: 45,
    price: 180,
    status: "Available"
  },
  {
    id: "M4",
    name: "Family Meal Pack",
    category: "Family Special",
    ordersThisWeek: 31,
    price: 420,
    status: "Limited Availability"
  }
];

export const mockPlans: SubscriptionPlan[] = [
  {
    id: "P1",
    name: "Lunch Only Plan",
    price: "₹2800/month",
    subscribersCount: 48,
    status: "Active"
  },
  {
    id: "P2",
    name: "Lunch + Dinner Plan",
    price: "₹4900/month",
    subscribersCount: 31,
    status: "Active"
  },
  {
    id: "P3",
    name: "Family Plan",
    price: "₹8500/month",
    subscribersCount: 12,
    status: "Active"
  },
  {
    id: "P4",
    name: "Custom Plan",
    price: "Custom Pricing",
    subscribersCount: 7,
    status: "Flexible"
  }
];

export const mockActivities: ActivityFeedItem[] = [
  {
    id: "A1",
    text: "Riya Patel purchased Lunch Only Plan",
    initials: "RP",
    timestamp: "2 mins ago"
  },
  {
    id: "A2",
    text: "Amit Shah renewed Family Plan",
    initials: "AS",
    timestamp: "15 mins ago"
  },
  {
    id: "A3",
    text: "Nidhi Mehta upgraded to Lunch + Dinner Plan",
    initials: "NM",
    timestamp: "1 hour ago"
  },
  {
    id: "A4",
    text: "Yash Desai paused subscription",
    initials: "YD",
    timestamp: "Today"
  },
  {
    id: "A5",
    text: "Pooja Trivedi renewed Custom Plan",
    initials: "PT",
    timestamp: "Yesterday"
  }
];

export const mockNotifications: SystemNotification[] = [
  {
    id: "N1",
    text: "15 Lunch Orders Need Preparation",
    priority: "high"
  },
  {
    id: "N2",
    text: "8 Subscription Renewals Due Tomorrow",
    priority: "medium"
  },
  {
    id: "N3",
    text: "New Customer Joined: Het Patel",
    priority: "info"
  },
  {
    id: "N4",
    text: "Family Plan Reached 80% Capacity",
    priority: "medium"
  },
  {
    id: "N5",
    text: "2 Delivery Delays Reported",
    priority: "high"
  }
];
export const mockCustomers = [
  { id: 1, name: "Rahul Mehta", email: "rahul@gmail.com", activePlan: "Lunch Only", address: "HSR Layout Sector 3", status: "Active", latitude: 12.9716, longitude: 77.5946 },
  { id: 2, name: "Sneha Patel", email: "sneha@gmail.com", activePlan: "Family Plan", address: "Koramangala 4th Block", status: "Active", latitude: 12.9352, longitude: 77.6245 },
  { id: 3, name: "Karan Shah", email: "karan@gmail.com", activePlan: "Lunch + Dinner", address: "Indiranagar 100ft Rd", status: "Active", latitude: 12.9780, longitude: 77.6410 },
  { id: 4, name: "Neha Joshi", email: "neha@gmail.com", activePlan: "Custom Plan", address: "Whitefield Inner Circle", status: "Active", latitude: 12.9833, longitude: 77.7352 },
  { id: 5, name: "Dhruv Desai", email: "dhruv@gmail.com", activePlan: "Lunch Only", address: "Jayanagar 5th Block", status: "Active", latitude: 12.9260, longitude: 77.5938 },
  { id: 6, name: "Riya Patel", email: "riya@gmail.com", activePlan: "Lunch Only", address: "Bellandur Outer Ring Rd", status: "Active", latitude: 12.9235, longitude: 77.6885 },
  { id: 7, name: "Amit Shah", email: "amit@gmail.com", activePlan: "Family Plan", address: "BTM Layout 2nd Stage", status: "Active", latitude: 12.9170, longitude: 77.6075 }
];
