export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface Transaction {
  id: string;
  date: string;
  source: string;
  customerName: string;
  amount: number; // e.g. 2800
  status: TransactionStatus;
}

export interface RevenueStats {
  todayRevenue: number; // e.g. 8450
  weeklyRevenue: number; // e.g. 58500
  monthlyRevenue: number; // e.g. 238700
  avgOrderValue: number; // e.g. 176
}

export interface DailyRevenuePoint {
  day: string; // Mon, Tue...
  revenue: number;
}

export interface MonthlyRevenuePoint {
  month: string; // Jan, Feb...
  revenue: number;
}

export interface PlanRevenuePoint {
  name: string;
  revenue: number;
}

export interface DistributionPoint {
  name: string;
  value: number; // percentage, e.g. 72
}

export interface TopMealRevenue {
  name: string;
  orders: number;
  revenue: number;
  growth: number; // e.g. 18 for +18%
}

export interface TopCustomerRevenue {
  name: string;
  lifetimeValue: number;
  planName: string;
  ordersCount: number;
}

export interface RevenueGoal {
  title: string;
  goalValue: number; // e.g. 250000
  currentValue: number; // e.g. 238700
  progressPercentage: number; // e.g. 95
  unit: string; // e.g. "₹" or "Subscribers"
}

export interface BusinessInsight {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'info';
}
