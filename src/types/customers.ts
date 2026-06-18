export type SubscriptionStatus = 'Active' | 'Paused' | 'Renewal Due' | 'Expired';

export interface ActivityLog {
  id: string;
  text: string;
  timestamp: string;
}

export interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  currentPlan: string;
  joinDate: string;
  status: SubscriptionStatus;
  lifetimeValue: number; // e.g. 8450
  lastOrderDate: string;
  deliveryAddress: string;
  mealsPerWeek: string;
  totalOrders: number;
  favoriteMeal: string;
  avgMonthlySpend: number; // e.g. 2800
  activityFeed: ActivityLog[];
  isNew?: boolean; // Joined within last 30 days
  isLoyal?: boolean; // Subscribed for 6+ months
  latitude?: number;
  longitude?: number;
}

export interface CustomerStats {
  totalCustomers: number;
  activeSubscribers: number;
  newCustomersThisMonth: number;
  avgRetentionRate: number; // e.g. 89
}

export interface CustomerSegment {
  name: string;
  count: number;
  definition: string;
  type: 'loyal' | 'new' | 'high_value' | 'at_risk';
}

export interface CustomerGrowthPoint {
  month: string;
  customers: number;
}

export interface SubscribersByPlanPoint {
  name: string;
  subscribers: number;
}

export interface RetentionTrendPoint {
  month: string;
  rate: number; // e.g. 78
}

export interface TopCustomer {
  rank: 1 | 2 | 3;
  name: string;
  lifetimeValue: number;
  ordersPlaced: number;
  currentPlan: string;
}
