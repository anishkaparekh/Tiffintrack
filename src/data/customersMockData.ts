import { CustomerItem, CustomerStats, CustomerSegment, CustomerGrowthPoint, SubscribersByPlanPoint, RetentionTrendPoint, TopCustomer } from '../types/customers';

export const mockCustomersList: CustomerItem[] = [
  {
    id: "C1",
    name: "Riya Patel",
    phone: "9876543210",
    email: "riya@example.com",
    currentPlan: "Lunch Only Plan",
    joinDate: "12 Jan 2026",
    status: "Active",
    lifetimeValue: 8450,
    lastOrderDate: "08 Jun 2026",
    deliveryAddress: "A-402, Shivalik Plaza, Vastrapur, Ahmedabad",
    mealsPerWeek: "6 Meals",
    totalOrders: 37,
    favoriteMeal: "Gujarati Thali",
    avgMonthlySpend: 2800,
    isLoyal: true,
    activityFeed: [
      { id: "a1", text: "Placed New Order", timestamp: "Yesterday" },
      { id: "a2", text: "Renewed Subscription - Lunch Only Plan", timestamp: "Last week" },
      { id: "a3", text: "Purchased Lunch Only Plan", timestamp: "5 months ago" }
    ]
  },
  {
    id: "C2",
    name: "Amit Shah",
    phone: "9988776655",
    email: "amit@example.com",
    currentPlan: "Family Plan",
    joinDate: "04 Feb 2026",
    status: "Active",
    lifetimeValue: 15300,
    lastOrderDate: "09 Jun 2026",
    deliveryAddress: "G-104, Sun Divine, Prahlad Nagar, Ahmedabad",
    mealsPerWeek: "14 Family Meals",
    totalOrders: 68,
    favoriteMeal: "Gujarati Thali",
    avgMonthlySpend: 8500,
    isLoyal: true,
    activityFeed: [
      { id: "b1", text: "Placed New Order", timestamp: "2 hours ago" },
      { id: "b2", text: "Upgraded to Family Plan from Lunch + Dinner Plan", timestamp: "Last week" },
      { id: "b3", text: "Renewed Subscription - Lunch + Dinner Plan", timestamp: "1 month ago" },
      { id: "b4", text: "Purchased Lunch + Dinner Plan", timestamp: "4 months ago" }
    ]
  },
  {
    id: "C3",
    name: "Nidhi Mehta",
    phone: "9123456789",
    email: "nidhi@example.com",
    currentPlan: "Lunch + Dinner Plan",
    joinDate: "15 Apr 2026",
    status: "Paused",
    lifetimeValue: 6850,
    lastOrderDate: "03 Jun 2026",
    deliveryAddress: "C-12, Orchid Elegance, Bodakdev, Ahmedabad",
    mealsPerWeek: "12 Meals",
    totalOrders: 24,
    favoriteMeal: "Paneer Combo",
    avgMonthlySpend: 4900,
    activityFeed: [
      { id: "c1", text: "Paused Subscription", timestamp: "Yesterday" },
      { id: "c2", text: "Placed New Order", timestamp: "Last week" },
      { id: "c3", text: "Purchased Lunch + Dinner Plan", timestamp: "2 months ago" }
    ]
  },
  {
    id: "C4",
    name: "Yash Desai",
    phone: "9871234560",
    email: "yash@example.com",
    currentPlan: "Custom Plan",
    joinDate: "20 May 2026",
    status: "Renewal Due",
    lifetimeValue: 3200,
    lastOrderDate: "01 Jun 2026",
    deliveryAddress: "12A, Sterling City, Bopal, Ahmedabad",
    mealsPerWeek: "Flexible",
    totalOrders: 10,
    favoriteMeal: "Jain Lunch Box",
    avgMonthlySpend: 3200,
    isNew: true,
    activityFeed: [
      { id: "d1", text: "Placed New Order", timestamp: "Last week" },
      { id: "d2", text: "Purchased Custom Plan", timestamp: "3 weeks ago" }
    ]
  },
  {
    id: "C5",
    name: "Pooja Trivedi",
    phone: "9898989898",
    email: "pooja@example.com",
    currentPlan: "Lunch Only Plan",
    joinDate: "30 Mar 2026",
    status: "Active",
    lifetimeValue: 9750,
    lastOrderDate: "09 Jun 2026",
    deliveryAddress: "E-308, Maple County, Bodakdev, Ahmedabad",
    mealsPerWeek: "6 Meals",
    totalOrders: 42,
    favoriteMeal: "Gujarati Thali",
    avgMonthlySpend: 2800,
    activityFeed: [
      { id: "e1", text: "Placed New Order", timestamp: "2 hours ago" },
      { id: "e2", text: "Renewed Subscription - Lunch Only Plan", timestamp: "Yesterday" },
      { id: "e3", text: "Purchased Lunch Only Plan", timestamp: "2 months ago" }
    ]
  }
];

export const mockCustomerStats: CustomerStats = {
  totalCustomers: 126,
  activeSubscribers: 98,
  newCustomersThisMonth: 18,
  avgRetentionRate: 89
};

export const mockCustomerSegments: CustomerSegment[] = [
  {
    name: "Loyal Customers",
    count: 42,
    definition: "Subscribed for 6+ months",
    type: "loyal"
  },
  {
    name: "New Subscribers",
    count: 18,
    definition: "Joined within the last 30 days",
    type: "new"
  },
  {
    name: "High-Value Customers",
    count: 15,
    definition: "Spent more than ₹10,000",
    type: "high_value"
  },
  {
    name: "At-Risk Customers",
    count: 8,
    definition: "Renewal due within 7 days",
    type: "at_risk"
  }
];

export const mockCustomerGrowth: CustomerGrowthPoint[] = [
  { month: "Jan", customers: 45 },
  { month: "Feb", customers: 58 },
  { month: "Mar", customers: 73 },
  { month: "Apr", customers: 88 },
  { month: "May", customers: 108 },
  { month: "Jun", customers: 126 }
];

export const mockSubscribersByPlan: SubscribersByPlanPoint[] = [
  { name: "Lunch Only Plan", subscribers: 48 },
  { name: "Lunch + Dinner Plan", subscribers: 31 },
  { name: "Family Plan", subscribers: 12 },
  { name: "Custom Plan", subscribers: 7 }
];

export const mockRetentionTrend: RetentionTrendPoint[] = [
  { month: "Jan", rate: 78 },
  { month: "Feb", rate: 80 },
  { month: "Mar", rate: 82 },
  { month: "Apr", rate: 85 },
  { month: "May", rate: 87 },
  { month: "Jun", rate: 89 }
];

export const mockTopCustomers: TopCustomer[] = [
  {
    rank: 1,
    name: "Amit Shah",
    lifetimeValue: 15300,
    ordersPlaced: 68,
    currentPlan: "Family Plan"
  },
  {
    rank: 2,
    name: "Pooja Trivedi",
    lifetimeValue: 9750,
    ordersPlaced: 42,
    currentPlan: "Lunch Only Plan"
  },
  {
    rank: 3,
    name: "Riya Patel",
    lifetimeValue: 8450,
    ordersPlaced: 37,
    currentPlan: "Lunch Only Plan"
  }
];
