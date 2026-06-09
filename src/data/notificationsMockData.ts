import { NotificationItem, NotificationPreferences, NotificationStats } from '../types/notifications';

// Helper to calculate date relative to current time for consistent timeline visualization
const getRelativeDate = (hoursAgo: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

export const mockNotificationsList: NotificationItem[] = [
  // --- TODAY (18 notifications total) ---
  {
    id: 'NOT-001',
    category: 'order',
    title: '15 Lunch Orders Need Preparation',
    message: 'You have 15 lunch orders scheduled within the next 2 hours.',
    timestamp: '5 minutes ago',
    priority: 'High',
    read: false,
    pinned: true,
    createdAt: getRelativeDate(0.08) // 5 mins ago
  },
  {
    id: 'NOT-002',
    category: 'order',
    title: 'Order TT1036 Delivered Successfully',
    message: 'The delivery for Order TT1036 has been completed.',
    timestamp: '20 minutes ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(0.33) // 20 mins ago
  },
  {
    id: 'NOT-003',
    category: 'delivery',
    title: 'Delivery Delay Reported',
    message: 'Two deliveries may be delayed due to traffic conditions near Prahlad Nagar.',
    timestamp: '30 minutes ago',
    priority: 'High',
    read: false,
    pinned: true,
    createdAt: getRelativeDate(0.5) // 30 mins ago
  },
  {
    id: 'NOT-004',
    category: 'subscription',
    title: '8 Subscription Renewals Due Tomorrow',
    message: 'Customers with expiring subscriptions need attention to ensure continuity.',
    timestamp: '45 minutes ago',
    priority: 'Medium',
    read: false,
    pinned: true,
    createdAt: getRelativeDate(0.75) // 45 mins ago
  },
  {
    id: 'NOT-005',
    category: 'subscription',
    title: 'New Family Plan Subscription Purchased',
    message: 'Amit Shah subscribed to the Family Plan for 30 days.',
    timestamp: '1 hour ago',
    priority: 'Info',
    read: false,
    createdAt: getRelativeDate(1)
  },
  {
    id: 'NOT-006',
    category: 'customer',
    title: 'New Customer Joined',
    message: 'Het Patel has subscribed to your Lunch Only Plan.',
    timestamp: '2 hours ago',
    priority: 'Info',
    read: false,
    createdAt: getRelativeDate(2)
  },
  {
    id: 'NOT-007',
    category: 'order',
    title: 'Order TT1035 Cancelled by Customer',
    message: 'Karan Malhotra cancelled Order TT1035 due to a meeting conflict.',
    timestamp: '3 hours ago',
    priority: 'Medium',
    read: true,
    createdAt: getRelativeDate(3)
  },
  {
    id: 'NOT-008',
    category: 'delivery',
    title: 'Delivery Partner Assigned',
    message: 'Ramesh Kumar is assigned to deliver your evening slot orders.',
    timestamp: '4 hours ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(4)
  },
  {
    id: 'NOT-009',
    category: 'customer',
    title: 'Special Delivery Note Added',
    message: 'Client Simran Jeet requested "Ring bell and leave food at security guard gate".',
    timestamp: '5 hours ago',
    priority: 'Info',
    read: false,
    createdAt: getRelativeDate(5)
  },
  {
    id: 'NOT-010',
    category: 'order',
    title: 'New Custom Order Request',
    message: 'Request from Mrs. Sharma for Jain food variations in 5 subscription meals.',
    timestamp: '6 hours ago',
    priority: 'Medium',
    read: true,
    createdAt: getRelativeDate(6)
  },
  {
    id: 'NOT-011',
    category: 'system',
    title: 'App System Maintenance Complete',
    message: 'TiffinTrack vendor services have been fully updated to version 2.4.1.',
    timestamp: '7 hours ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(7)
  },
  {
    id: 'NOT-012',
    category: 'subscription',
    title: 'Trial Plan Converted to Active',
    message: 'Rohit Mehta upgraded from the 3-Day Trial to the Monthly Executive Plan.',
    timestamp: '8 hours ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(8)
  },
  {
    id: 'NOT-013',
    category: 'customer',
    title: 'Customer Inquiry Received',
    message: 'Deepak Rao sent a query: "Are containers microwave-friendly?"',
    timestamp: '9 hours ago',
    priority: 'Info',
    read: false,
    createdAt: getRelativeDate(9)
  },
  {
    id: 'NOT-014',
    category: 'order',
    title: 'Payment Confirmed for Order TT1042',
    message: 'Payment received successfully from Sneha Sen.',
    timestamp: '10 hours ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(10)
  },
  {
    id: 'NOT-015',
    category: 'delivery',
    title: 'Delivery Address Altered',
    message: 'High Priority: Customer Devansh Joshi updated address details for order TT1039.',
    timestamp: '11 hours ago',
    priority: 'High',
    read: true, // Read, High Priority
    createdAt: getRelativeDate(11)
  },
  {
    id: 'NOT-016',
    category: 'system',
    title: 'Weekly Payout Initiated',
    message: 'Your payout of ₹14,890 has been processed and sent to your registered bank account.',
    timestamp: '12 hours ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(12)
  },
  {
    id: 'NOT-017',
    category: 'order',
    title: 'Bulk Corporate Inquiry received',
    message: 'Google SG Road office requested quotes for 25 recurring daily dinner thalis.',
    timestamp: '13 hours ago',
    priority: 'Medium',
    read: true,
    createdAt: getRelativeDate(13)
  },
  {
    id: 'NOT-018',
    category: 'system',
    title: 'High Temperature Advisory',
    message: 'Safety Advisory: Kitchen ambient temperature is expected to reach 41°C. Keep ventilated.',
    timestamp: '14 hours ago',
    priority: 'Medium',
    read: true,
    createdAt: getRelativeDate(14)
  },

  // --- YESTERDAY ---
  {
    id: 'NOT-019',
    category: 'customer',
    title: 'Customer Feedback Received',
    message: 'Riya Patel rated Gujarati Thali 5 stars. "Amazing home taste, roti was very soft!"',
    timestamp: 'Yesterday',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(26)
  },
  {
    id: 'NOT-020',
    category: 'delivery',
    title: 'Delivery Schedule Updated',
    message: 'The evening delivery schedule has been optimized to bypass traffic near SG Highway.',
    timestamp: 'Yesterday',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(28)
  },
  {
    id: 'NOT-021',
    category: 'system',
    title: 'Business Performance Report Available',
    message: 'Your weekly performance report is ready to view. Your average rating is up by 4%.',
    timestamp: 'Yesterday',
    priority: 'Medium',
    read: false,
    createdAt: getRelativeDate(30)
  },
  {
    id: 'NOT-022',
    category: 'customer',
    title: 'Feedback: Spice Level Alert',
    message: 'Harsh Vyas rated Punjabi Combo 4 stars with feedback: "Slightly less spicy, please."',
    timestamp: 'Yesterday',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(32)
  },
  {
    id: 'NOT-023',
    category: 'order',
    title: 'Recurring Subscription Order Created',
    message: 'System automatically generated 18 orders for tomorrow morning’s dispatch.',
    timestamp: 'Yesterday',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(34)
  },
  {
    id: 'NOT-024',
    category: 'subscription',
    title: 'Subscription Paused by Customer',
    message: 'Megha Shah paused her Lunch Only Plan from June 10th to June 15th.',
    timestamp: 'Yesterday',
    priority: 'Medium',
    read: false,
    createdAt: getRelativeDate(36)
  },
  {
    id: 'NOT-025',
    category: 'customer',
    title: 'Allergy Warning Added',
    message: 'Customer Ananya Desai added allergy warnings: "Strictly Peanut Free Kitchen".',
    timestamp: 'Yesterday',
    priority: 'High',
    read: true, // Read, High priority
    createdAt: getRelativeDate(40)
  },
  {
    id: 'NOT-026',
    category: 'delivery',
    title: 'Delivery Agent Delayed Checkout',
    message: 'Agent Sandeep Patel checked out 15 minutes later than scheduled slot.',
    timestamp: 'Yesterday',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(44)
  },

  // --- EARLIER (Older) ---
  {
    id: 'NOT-027',
    category: 'system',
    title: 'New Feature Announcement',
    message: 'Explore the new customer insights dashboard to see your top subscribers.',
    timestamp: '3 days ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(72)
  },
  {
    id: 'NOT-028',
    category: 'subscription',
    title: 'Renewal Reminder Sent to Customers',
    message: 'System auto-emailed renewal details to 12 expiring subscribers.',
    timestamp: '4 days ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(96)
  },
  {
    id: 'NOT-029',
    category: 'system',
    title: 'FSSAI License Expiry Warning',
    message: 'Your FSSAI kitchen registration expires in 25 days. Please update your document details.',
    timestamp: '5 days ago',
    priority: 'High',
    read: false, // Unread, High priority
    createdAt: getRelativeDate(120)
  },
  {
    id: 'NOT-030',
    category: 'customer',
    title: 'Customer Subscription Cancellation',
    message: 'Rohan Joshi cancelled Executive Dinner Plan. Reason: Relocating outside city.',
    timestamp: '5 days ago',
    priority: 'Medium',
    read: true,
    createdAt: getRelativeDate(122)
  },
  {
    id: 'NOT-031',
    category: 'delivery',
    title: 'Delivery Zone Expansion',
    message: 'Good news! TiffinTrack expanded operations to include South Bopal for kitchen delivery.',
    timestamp: '6 days ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(144)
  },
  {
    id: 'NOT-032',
    category: 'order',
    title: 'Pre-order Milestone Met',
    message: 'Congratulations! You secured over 200 lunch pre-orders this week.',
    timestamp: '6 days ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(148)
  },
  {
    id: 'NOT-033',
    category: 'system',
    title: 'Weekly Payout Disbursed',
    message: 'Payout ref TXN7781033 has been successfully credited to your HDFC account.',
    timestamp: '7 days ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(168)
  },
  {
    id: 'NOT-034',
    category: 'customer',
    title: 'Customer Review Received',
    message: 'Manoj Patel rated Jain Special Meal 5 stars: "Extremely hygienic and light." ',
    timestamp: '7 days ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(170)
  },
  {
    id: 'NOT-035',
    category: 'subscription',
    title: 'Group Corporate Subscription Renewed',
    message: 'Adani Logistics Renewed their 10-Meals Pack Plan.',
    timestamp: '8 days ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(192)
  },
  {
    id: 'NOT-036',
    category: 'system',
    title: 'GST Identification Updates',
    message: 'Optional: Update your GST registration details inside the Profile Settings tab.',
    timestamp: '9 days ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(216)
  },
  {
    id: 'NOT-037',
    category: 'delivery',
    title: 'Customer Reported Damage',
    message: 'Order TT0912 client claimed liquid leakage in buttermilk container. Box refunded.',
    timestamp: '10 days ago',
    priority: 'Medium',
    read: true,
    createdAt: getRelativeDate(240)
  },
  {
    id: 'NOT-038',
    category: 'customer',
    title: 'New Customer Subscribed',
    message: 'Preeti Adani joined Gujarati Regular Meal Plan.',
    timestamp: '11 days ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(264)
  },
  {
    id: 'NOT-039',
    category: 'order',
    title: 'Large Catering Order Scheduled',
    message: 'Corporate preorder of 50 packs placed for June 20th.',
    timestamp: '12 days ago',
    priority: 'Medium',
    read: true,
    createdAt: getRelativeDate(288)
  },
  {
    id: 'NOT-040',
    category: 'system',
    title: 'TiffinTrack Kitchen Verification Successful',
    message: 'Your kitchen was marked Verified! A verified badge has been added to your profile.',
    timestamp: '2 weeks ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(336)
  },
  {
    id: 'NOT-041',
    category: 'customer',
    title: 'Customer Review Received',
    message: 'Kuntal Shah rated Healthy Diet Meal 5 stars.',
    timestamp: '2 weeks ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(340)
  },
  {
    id: 'NOT-042',
    category: 'subscription',
    title: 'Subscription Cancellation Alert',
    message: 'Jigisha Shah cancelled High Protein Plan due to cooking at home.',
    timestamp: '2 weeks ago',
    priority: 'Medium',
    read: true,
    createdAt: getRelativeDate(344)
  },
  {
    id: 'NOT-043',
    category: 'system',
    title: 'Security Alert: Password Updated',
    message: 'Your account login password was changed successfully.',
    timestamp: '2 weeks ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(350)
  },
  {
    id: 'NOT-044',
    category: 'delivery',
    title: 'Delivery Agent Application Approved',
    message: 'A new dedicated delivery partner was allocated to your zone.',
    timestamp: '3 weeks ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(504)
  },
  {
    id: 'NOT-045',
    category: 'customer',
    title: 'Customer Query Received',
    message: 'Amit Patel query: "Do you deliver on public holidays?"',
    timestamp: '3 weeks ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(508)
  },
  {
    id: 'NOT-046',
    category: 'order',
    title: 'Promo Code Bonus Credited',
    message: '₹500 marketing reward added to your account for promo coupon usage.',
    timestamp: '3 weeks ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(512)
  },
  {
    id: 'NOT-047',
    category: 'subscription',
    title: 'Subscription Expired',
    message: 'Gaurang Trivedi Dinner Plan expired without auto-renewal.',
    timestamp: '4 weeks ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(672)
  },
  {
    id: 'NOT-048',
    category: 'system',
    title: 'Kitchen Profile Setup Complete',
    message: 'Welcome to TiffinTrack! Your merchant dashboard setup has been completed successfully.',
    timestamp: '1 month ago',
    priority: 'Info',
    read: true,
    createdAt: getRelativeDate(720)
  }
];

export const defaultPreferences: NotificationPreferences = {
  orderAlerts: true,
  subscriptionRenewals: true,
  deliveryUpdates: true,
  customerMessages: true,
  weeklyReports: false,
  marketingUpdates: false
};

export const mockStatsData: NotificationStats = {
  total: 48,
  unread: 12,
  highPriorityAlerts: 5,
  todayCount: 18
};

export const mockPinnedAlerts = [
  {
    id: 'NOT-001',
    title: '15 Lunch Orders Need Preparation',
    category: 'order',
    message: 'You have 15 lunch orders scheduled within the next 2 hours.',
    priority: 'High' as const,
    timestamp: '5 minutes ago'
  },
  {
    id: 'NOT-004',
    title: '8 Subscription Renewals Due Tomorrow',
    category: 'subscription',
    message: 'Customers with expiring subscriptions need attention to ensure continuity.',
    priority: 'Medium' as const,
    timestamp: '45 minutes ago'
  },
  {
    id: 'NOT-003',
    title: 'Delivery Delay Reported',
    category: 'delivery',
    message: 'Two deliveries may be delayed due to traffic conditions near Prahlad Nagar.',
    priority: 'High' as const,
    timestamp: '30 minutes ago'
  }
];
