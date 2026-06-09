import { MealItem, MealStats, BestPerformingMeal } from '../types/meals';

export const mockMealsList: MealItem[] = [
  {
    id: "M1",
    name: "Gujarati Thali",
    category: "Traditional",
    description: "Roti, dal, rice, sabzi, farsan, and dessert.",
    price: 140,
    weeklyOrders: 84,
    status: "Available",
    type: "Veg"
  },
  {
    id: "M2",
    name: "Jain Lunch Box",
    category: "Jain Special",
    description: "Fresh Jain meal prepared without onion and garlic.",
    price: 130,
    weeklyOrders: 52,
    status: "Available",
    type: "Jain"
  },
  {
    id: "M3",
    name: "Paneer Combo",
    category: "North Indian",
    description: "Paneer curry, naan, rice, and dessert.",
    price: 180,
    weeklyOrders: 45,
    status: "Available",
    type: "Veg"
  },
  {
    id: "M4",
    name: "Family Meal Pack",
    category: "Family Specials",
    description: "Complete meal for four people.",
    price: 420,
    weeklyOrders: 31,
    status: "Limited Availability",
    type: "Veg"
  },
  {
    id: "M5",
    name: "Healthy Millet Bowl",
    category: "Healthy Meals",
    description: "Nutritious millet bowl with vegetables.",
    price: 160,
    weeklyOrders: 18,
    status: "Available",
    type: "Veg"
  },
  {
    id: "M6",
    name: "South Indian Combo",
    category: "South Indian",
    description: "Idli, dosa, chutney, and sambar.",
    price: 120,
    weeklyOrders: 24,
    status: "Unavailable",
    type: "Veg"
  },
  // Additional 12 meals to reach a total of 18
  {
    id: "M7",
    name: "Kathiyawadi Thali",
    category: "Traditional",
    description: "Bajra rotla, ringna no olo, garlic chutney, and khichdi.",
    price: 150,
    weeklyOrders: 20,
    status: "Available",
    type: "Veg"
  },
  {
    id: "M8",
    name: "Jain Khichdi Box",
    category: "Jain Special",
    description: "Sattvic moong dal khichdi served with kadhi and papad.",
    price: 110,
    weeklyOrders: 15,
    status: "Available",
    type: "Jain"
  },
  {
    id: "M9",
    name: "Chole Bhature Pack",
    category: "North Indian",
    description: "Spicy chickpea curry served with two fried bhature.",
    price: 140,
    weeklyOrders: 16,
    status: "Available",
    type: "Veg"
  },
  {
    id: "M10",
    name: "Masala Dosa Special",
    category: "South Indian",
    description: "Crispy dosa with potato filling served with sambar and coconut chutney.",
    price: 100,
    weeklyOrders: 10,
    status: "Available",
    type: "Veg"
  },
  {
    id: "M11",
    name: "Quinoa Salad Bowl",
    category: "Healthy Meals",
    description: "Organic quinoa with bell peppers, cucumbers, and olive dressing.",
    price: 170,
    weeklyOrders: 8,
    status: "Available",
    type: "Veg"
  },
  {
    id: "M12",
    name: "Mini Party Platter",
    category: "Family Specials",
    description: "Selection of samosas, dhoklas, and paneer tikka bites.",
    price: 320,
    weeklyOrders: 12,
    status: "Limited Availability",
    type: "Veg"
  },
  {
    id: "M13",
    name: "Moong Dal Halwa",
    category: "Snacks",
    description: "Traditional rich sweet dessert made with split green gram.",
    price: 80,
    weeklyOrders: 9,
    status: "Available",
    type: "Veg"
  },
  {
    id: "M14",
    name: "Masala Chai Flask",
    category: "Beverages",
    description: "Warm brewed milk tea infused with ginger and cardamom (Serves 4).",
    price: 70,
    weeklyOrders: 14,
    status: "Available",
    type: "Veg"
  },
  {
    id: "M15",
    name: "Paneer Paratha Box",
    category: "North Indian",
    description: "Two wheat flatbreads stuffed with spiced cottage cheese served with curd.",
    price: 130,
    weeklyOrders: 7,
    status: "Available",
    type: "Veg"
  },
  {
    id: "M16",
    name: "Steamed Idli Set",
    category: "South Indian",
    description: "Four soft rice cakes served with hot sambar and tomato chutney.",
    price: 90,
    weeklyOrders: 5,
    status: "Available",
    type: "Veg"
  },
  {
    id: "M17",
    name: "Jain Dal Baati Thali",
    category: "Jain Special",
    description: "Baked wheat balls served with mixed lentil curry, ghee, and churma.",
    price: 170,
    weeklyOrders: 6,
    status: "Unavailable",
    type: "Jain"
  },
  {
    id: "M18",
    name: "Diet Salad Bowl",
    category: "Healthy Meals",
    description: "Mixed greens, sprouts, broccoli, almonds, and low-fat paneer blocks.",
    price: 150,
    weeklyOrders: 3,
    status: "Unavailable",
    type: "Veg"
  }
];

export const mockMealsStats: MealStats = {
  totalMeals: 18,
  availableMeals: 14,
  bestSellerName: "Gujarati Thali",
  bestSellerOrders: 84,
  weeklyOrdersTotal: 212,
  weeklyOrdersIncreasePercent: 15
};

export const mockBestPerformingMeals: BestPerformingMeal[] = [
  {
    name: "Gujarati Thali",
    weeklyOrders: 84,
    revenue: 11760,
    rank: 1
  },
  {
    name: "Jain Lunch Box",
    weeklyOrders: 52,
    revenue: 6760,
    rank: 2
  },
  {
    name: "Paneer Combo",
    weeklyOrders: 45,
    revenue: 8100,
    rank: 3
  }
];
export const mockImages = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400"
];
