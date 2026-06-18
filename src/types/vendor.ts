export interface VendorProfile {
  name: string;
  role: string;
  initials: string;
  businessLatitude?: number;
  businessLongitude?: number;
}

export type TrendType = 'up' | 'down' | 'neutral';

export interface StatsCardData {
  title: string;
  value: string;
  changeText: string;
  trend: TrendType;
  iconName: string;
}

export interface RevenuePoint {
  label: string;
  value: number;
}

export interface RevenueData {
  daily: RevenuePoint[];
  weekly: RevenuePoint[];
  monthly: RevenuePoint[];
}

export type OrderStatus = 'preparing' | 'delivered' | 'out_for_delivery' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  plan: string;
  status: OrderStatus;
  deliveryTime: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
}

export type MealStatus = 'Available' | 'Limited Availability' | 'Unavailable';

export interface Meal {
  id: string;
  name: string;
  category: string;
  ordersThisWeek: number;
  price: number;
  status: MealStatus;
}

export type PlanStatus = 'Active' | 'Flexible' | 'Inactive';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  subscribersCount: number;
  status: PlanStatus;
}

export interface ActivityFeedItem {
  id: string;
  text: string;
  initials: string;
  timestamp: string;
}

export type NotificationPriority = 'high' | 'medium' | 'info';

export interface SystemNotification {
  id: string;
  text: string;
  priority: NotificationPriority;
}
