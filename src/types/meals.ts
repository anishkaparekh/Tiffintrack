export type MealCategory = 
  | 'Traditional' 
  | 'Jain Special' 
  | 'North Indian' 
  | 'South Indian' 
  | 'Healthy Meals' 
  | 'Family Specials' 
  | 'Snacks' 
  | 'Beverages';

export type MealAvailability = 'Available' | 'Unavailable' | 'Limited Availability';

export type MealDietType = 'Veg' | 'Jain';

export interface MealItem {
  id: string;
  name: string;
  category: MealCategory;
  description: string;
  price: number;
  weeklyOrders: number;
  status: MealAvailability;
  type: MealDietType;
  imageUrl?: string;
}

export interface MealStats {
  totalMeals: number;
  availableMeals: number;
  bestSellerName: string;
  bestSellerOrders: number;
  weeklyOrdersTotal: number;
  weeklyOrdersIncreasePercent: number;
}

export interface BestPerformingMeal {
  name: string;
  weeklyOrders: number;
  revenue: number;
  rank: 1 | 2 | 3;
}
