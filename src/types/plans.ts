export type PlanStatus = 'Active' | 'Paused' | 'Draft' | 'Archived';

export interface PlanItem {
  id: string;
  name: string;
  description: string;
  includedMeals?: string[];
  mealsPerWeek: string;
  monthlyPrice: string;
  subscriberCount: number;
  revenueGenerated: number;
  duration: string;
  status: PlanStatus;
}

export interface PlanStats {
  totalPlans: number;
  activeSubscribers: number;
  monthlyRecurringRevenue: number;
  mostPopularPlanName: string;
  mostPopularPlanSubscribers: number;
}

export interface TopPerformingPlan {
  name: string;
  subscribers: number;
  revenueGenerated: number;
  growthPercentage: number;
  rank: 1 | 2 | 3;
}

export interface SubscriberGrowthPoint {
  month: string;
  subscribers: number;
}

export interface PlanRevenuePoint {
  name: string;
  revenue: number;
}

export interface PlanDistributionPoint {
  name: string;
  value: number;
}
