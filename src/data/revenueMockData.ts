import { 
  Transaction, 
  RevenueStats, 
  DailyRevenuePoint, 
  MonthlyRevenuePoint, 
  PlanRevenuePoint, 
  DistributionPoint, 
  TopMealRevenue, 
  TopCustomerRevenue, 
  RevenueGoal, 
  BusinessInsight 
} from '../types/revenue';

export const mockRevenueStats: RevenueStats = {
  todayRevenue: 8450,
  weeklyRevenue: 58500,
  monthlyRevenue: 238700,
  avgOrderValue: 176
};

export const mockDailyRevenue: DailyRevenuePoint[] = [
  { day: "Mon", revenue: 6100 },
  { day: "Tue", revenue: 7850 },
  { day: "Wed", revenue: 8450 },
  { day: "Thu", revenue: 7900 },
  { day: "Fri", revenue: 9200 },
  { day: "Sat", revenue: 10300 },
  { day: "Sun", revenue: 8700 }
];

export const mockMonthlyRevenue: MonthlyRevenuePoint[] = [
  { month: "Jan", revenue: 182000 },
  { month: "Feb", revenue: 195000 },
  { month: "Mar", revenue: 208000 },
  { month: "Apr", revenue: 215000 },
  { month: "May", revenue: 228000 },
  { month: "Jun", revenue: 238700 }
];

export const mockPlanRevenue: PlanRevenuePoint[] = [
  { name: "Lunch Only Plan", revenue: 134400 },
  { name: "Lunch + Dinner Plan", revenue: 151900 },
  { name: "Family Plan", revenue: 102000 },
  { name: "Custom Plan", revenue: 35000 }
];

export const mockRevenueDistribution: DistributionPoint[] = [
  { name: "Subscriptions", value: 72 },
  { name: "One-Time Orders", value: 18 },
  { name: "Family Plans", value: 7 },
  { name: "Custom Plans", value: 3 }
];

export const mockTopMealsRevenue: TopMealRevenue[] = [
  { name: "Gujarati Thali", orders: 84, revenue: 11760, growth: 18 },
  { name: "Family Meal Pack", orders: 31, revenue: 13020, growth: 12 },
  { name: "Paneer Combo", orders: 45, revenue: 8100, growth: 9 },
  { name: "Jain Lunch Box", orders: 52, revenue: 6760, growth: 7 }
];

export const mockTopCustomersRevenue: TopCustomerRevenue[] = [
  { name: "Amit Shah", lifetimeValue: 15300, planName: "Family Plan", ordersCount: 68 },
  { name: "Pooja Trivedi", lifetimeValue: 9750, planName: "Lunch Only Plan", ordersCount: 42 },
  { name: "Riya Patel", lifetimeValue: 8450, planName: "Lunch Only Plan", ordersCount: 37 }
];

export const mockRevenueInsights: BusinessInsight[] = [
  { 
    id: "in-1", 
    text: "Lunch + Dinner Plan generated the highest revenue this month.", 
    type: "success" 
  },
  { 
    id: "in-2", 
    text: "Weekend revenue increased by 14% compared to weekdays.", 
    type: "info" 
  },
  { 
    id: "in-3", 
    text: "Gujarati Thali remains the best-selling meal.", 
    type: "success" 
  },
  { 
    id: "in-4", 
    text: "Subscription revenue accounts for over 70% of total earnings.", 
    type: "info" 
  },
  { 
    id: "in-5", 
    text: "Family Plans show the strongest customer retention.", 
    type: "success" 
  }
];

export const mockRevenueGoals: RevenueGoal[] = [
  {
    title: "Monthly Revenue Goal",
    goalValue: 250000,
    currentValue: 238700,
    progressPercentage: 95,
    unit: "₹"
  },
  {
    title: "Subscriber Growth Target",
    goalValue: 120,
    currentValue: 98,
    progressPercentage: 82,
    unit: "Users"
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: "TXN1001",
    date: "09 Jun 2026",
    source: "Lunch Only Plan",
    customerName: "Riya Patel",
    amount: 2800,
    status: "Completed"
  },
  {
    id: "TXN1002",
    date: "09 Jun 2026",
    source: "Family Plan",
    customerName: "Amit Shah",
    amount: 8500,
    status: "Completed"
  },
  {
    id: "TXN1003",
    date: "08 Jun 2026",
    source: "Paneer Combo",
    customerName: "Karan Shah",
    amount: 180,
    status: "Completed"
  },
  {
    id: "TXN1004",
    date: "08 Jun 2026",
    source: "Lunch Only Plan",
    customerName: "Pooja Trivedi",
    amount: 2800,
    status: "Completed"
  },
  {
    id: "TXN1005",
    date: "07 Jun 2026",
    source: "Lunch + Dinner Plan",
    customerName: "Nidhi Mehta",
    amount: 4900,
    status: "Completed"
  },
  {
    id: "TXN1006",
    date: "06 Jun 2026",
    source: "Custom Plan",
    customerName: "Yash Desai",
    amount: 3200,
    status: "Completed"
  },
  {
    id: "TXN1007",
    date: "05 Jun 2026",
    source: "Gujarati Thali",
    customerName: "Rahul Mehta",
    amount: 140,
    status: "Completed"
  },
  {
    id: "TXN1008",
    date: "04 Jun 2026",
    source: "Jain Lunch Box",
    customerName: "Neha Joshi",
    amount: 130,
    status: "Completed"
  }
];
