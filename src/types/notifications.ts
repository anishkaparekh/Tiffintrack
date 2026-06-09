export type NotificationCategory = 'order' | 'subscription' | 'customer' | 'delivery' | 'system';

export type NotificationPriority = 'High' | 'Medium' | 'Info';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  priority: NotificationPriority;
  read: boolean;
  pinned?: boolean;
  createdAt: string; // ISO date string or standard string for sorting
}

export interface NotificationPreferences {
  orderAlerts: boolean;
  subscriptionRenewals: boolean;
  deliveryUpdates: boolean;
  customerMessages: boolean;
  weeklyReports: boolean;
  marketingUpdates: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  highPriorityAlerts: number;
  todayCount: number;
}
