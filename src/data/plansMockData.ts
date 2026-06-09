import { 
  PlanItem, 
  PlanStats, 
  TopPerformingPlan, 
  SubscriberGrowthPoint, 
  PlanRevenuePoint,
  PlanDistributionPoint
} from '../types/plans';

export const mockPlansList: PlanItem[] = [
  {
    id: "P1",
    name: "Lunch Only Plan",
    description: "Healthy homemade lunch delivered every weekday.",
    includedMeals: ["Gujarati Thali", "Jain Lunch Box", "Paneer Combo"],
    mealsPerWeek: "6 Meals",
    monthlyPrice: "₹2,800/month",
    subscriberCount: 48,
    revenueGenerated: 134400,
    duration: "Monthly",
    status: "Active"
  },
  {
    id: "P2",
    name: "Lunch + Dinner Plan",
    description: "Complete lunch and dinner solution for working professionals.",
    includedMeals: ["Paneer Combo", "Healthy Millet Bowl", "South Indian Combo"],
    mealsPerWeek: "12 Meals",
    monthlyPrice: "₹4,900/month",
    subscriberCount: 31,
    revenueGenerated: 151900,
    duration: "Monthly",
    status: "Active"
  },
  {
    id: "P3",
    name: "Family Plan",
    description: "Nutritious family meals designed for four members.",
    includedMeals: ["Family Meal Pack", "Gujarati Thali", "Paneer Combo"],
    mealsPerWeek: "14 Family Meals",
    monthlyPrice: "₹8,500/month",
    subscriberCount: 12,
    revenueGenerated: 102000,
    duration: "Monthly",
    status: "Active"
  },
  {
    id: "P4",
    name: "Custom Plan",
    description: "Flexible subscription tailored to customer requirements.",
    includedMeals: ["Jain Lunch Box", "Healthy Millet Bowl"],
    mealsPerWeek: "Flexible",
    monthlyPrice: "Custom Pricing",
    subscriberCount: 7,
    revenueGenerated: 35000,
    duration: "Custom",
    status: "Paused"
  }
];

export const mockPlansStats: PlanStats = {
  totalPlans: 4,
  activeSubscribers: 98,
  monthlyRecurringRevenue: 238700,
  mostPopularPlanName: "Lunch Only Plan",
  mostPopularPlanSubscribers: 48
};

export const mockTopPerformingPlans: TopPerformingPlan[] = [
  {
    name: "Lunch Only Plan",
    subscribers: 48,
    revenueGenerated: 134400,
    growthPercentage: 18,
    rank: 1
  },
  {
    name: "Lunch + Dinner Plan",
    subscribers: 31,
    revenueGenerated: 151900,
    growthPercentage: 12,
    rank: 2
  },
  {
    name: "Family Plan",
    subscribers: 12,
    revenueGenerated: 102000,
    growthPercentage: 8,
    rank: 3
  }
];

export const mockSubscriberGrowth: SubscriberGrowthPoint[] = [
  { month: "Jan", subscribers: 55 },
  { month: "Feb", subscribers: 62 },
  { month: "Mar", subscribers: 71 },
  { month: "Apr", subscribers: 82 },
  { month: "May", subscribers: 91 },
  { month: "Jun", subscribers: 98 }
];

export const mockRevenueByPlan: PlanRevenuePoint[] = [
  { name: "Lunch Only", revenue: 134400 },
  { name: "Lunch + Dinner", revenue: 151900 },
  { name: "Family Plan", revenue: 102000 },
  { name: "Custom Plan", revenue: 35000 }
];

export const mockPlanDistribution: PlanDistributionPoint[] = [
  { name: "Lunch Only Plan", value: 48 },
  { name: "Lunch + Dinner Plan", value: 31 },
  { name: "Family Plan", value: 12 },
  { name: "Custom Plan", value: 7 }
];

export const mockAvailableMeals = [
  "Gujarati Thali",
  "Jain Lunch Box",
  "Paneer Combo",
  "Family Meal Pack",
  "Healthy Millet Bowl",
  "South Indian Combo",
  "Kathiyawadi Thali",
  "Jain Khichdi Box",
  "Chole Bhature Pack"
];
