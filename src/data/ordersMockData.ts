import { OrderItem, DeliveryScheduleItem, OrderPerformance, OrderStats } from '../types/orders';

export const mockOrdersList: OrderItem[] = [
  {
    id: "TT1032",
    customerName: "Aarav Patel",
    phone: "+91 98765 43210",
    address: "A-402, Shivalik Plaza, Vastrapur, Ahmedabad",
    mealName: "Gujarati Thali",
    plan: "Lunch Only Plan",
    status: "Preparing",
    deliveryTime: "12:00 PM",
    orderDate: "09 Jun 2026",
    quantity: 1,
    priority: "High",
    remainingMinutes: 20,
    deliveryInstructions: "Leave with security if not reachable. Ring bell twice.",
    assignedDriver: "Amit Kumar (+91 91234 56789)"
  },
  {
    id: "TT1036",
    customerName: "Priya Shah",
    phone: "+91 87654 32109",
    address: "B-705, Goyal Terrace, Satellite, Ahmedabad",
    mealName: "Paneer Combo",
    plan: "Lunch Only Plan",
    status: "Preparing",
    deliveryTime: "12:15 PM",
    orderDate: "09 Jun 2026",
    quantity: 1,
    priority: "Medium",
    remainingMinutes: 35,
    deliveryInstructions: "Call upon arrival. Ground floor flat.",
    assignedDriver: "Vikram Rathod (+91 92345 67890)"
  },
  {
    id: "TT1041",
    customerName: "Nidhi Mehta",
    phone: "+91 76543 21098",
    address: "C-12, Orchid Elegance, Bodakdev, Ahmedabad",
    mealName: "Jain Lunch Box",
    plan: "Custom Plan",
    status: "Out for Delivery",
    deliveryTime: "12:30 PM",
    orderDate: "09 Jun 2026",
    quantity: 2,
    priority: "On Track",
    remainingMinutes: 50,
    deliveryInstructions: "Jain food. Please keep it separate and handle with care.",
    assignedDriver: "Ramesh Solanki (+91 93456 78901)"
  },
  {
    id: "TT1024",
    customerName: "Rahul Mehta",
    phone: "+91 95432 10987",
    address: "42, Sharda Nagar Society, Satellite, Ahmedabad",
    mealName: "Gujarati Thali",
    plan: "Lunch Only Plan",
    status: "Preparing",
    deliveryTime: "12:30 PM",
    orderDate: "09 Jun 2026",
    quantity: 1,
    priority: "On Track",
    remainingMinutes: 50,
    deliveryInstructions: "Less spicy. Add extra buttermilk.",
    assignedDriver: "Ramesh Solanki (+91 93456 78901)"
  },
  {
    id: "TT1025",
    customerName: "Sneha Patel",
    phone: "+91 84321 09876",
    address: "G-104, Sun Divine, Prahlad Nagar, Ahmedabad",
    mealName: "Family Meal Pack",
    plan: "Family Plan",
    status: "Delivered",
    deliveryTime: "1:00 PM",
    orderDate: "09 Jun 2026",
    quantity: 1,
    priority: "On Track",
    deliveryInstructions: "Contactless delivery. Leave on the doorstep.",
    assignedDriver: "Jayesh Patel (+91 94567 89012)"
  },
  {
    id: "TT1026",
    customerName: "Karan Shah",
    phone: "+91 73210 98765",
    address: "12A, Sterling City, Bopal, Ahmedabad",
    mealName: "Paneer Combo",
    plan: "Lunch + Dinner Plan",
    status: "Out for Delivery",
    deliveryTime: "12:45 PM",
    orderDate: "09 Jun 2026",
    quantity: 1,
    priority: "On Track",
    remainingMinutes: 65,
    deliveryInstructions: "Ring bell. Deliver directly to office reception on 3rd floor.",
    assignedDriver: "Sanjay Sharma (+91 95678 90123)"
  },
  {
    id: "TT1027",
    customerName: "Neha Joshi",
    phone: "+91 62109 87654",
    address: "E-308, Maple County, Bodakdev, Ahmedabad",
    mealName: "Jain Lunch Box",
    plan: "Custom Plan",
    status: "Preparing",
    deliveryTime: "7:00 PM",
    orderDate: "09 Jun 2026",
    quantity: 1,
    priority: "On Track",
    remainingMinutes: 440,
    deliveryInstructions: "Evening delivery. Deliver before sunset if possible.",
    assignedDriver: "Not Assigned Yet"
  },
  {
    id: "TT1028",
    customerName: "Dhruv Desai",
    phone: "+91 51098 76543",
    address: "Building B, Titanium Heights, SG Highway, Ahmedabad",
    mealName: "Gujarati Thali",
    plan: "Lunch Only Plan",
    status: "Delivered",
    deliveryTime: "1:15 PM",
    orderDate: "09 Jun 2026",
    quantity: 1,
    priority: "On Track",
    deliveryInstructions: "Deliver to security gate.",
    assignedDriver: "Jayesh Patel (+91 94567 89012)"
  }
];

export const mockDeliverySchedule: DeliveryScheduleItem[] = [
  { timeSlot: "12:00 PM – 1:00 PM", orderCount: 18 },
  { timeSlot: "1:00 PM – 2:00 PM", orderCount: 12 },
  { timeSlot: "7:00 PM – 8:00 PM", orderCount: 18 }
];

export const mockOrderPerformance: OrderPerformance = {
  onTimeDeliveryRate: 96,
  avgPrepMinutes: 28,
  csatScore: 4.8
};

export const mockOrderStats: OrderStats = {
  todayOrders: 48,
  preparingOrders: 15,
  outForDeliveryOrders: 10,
  deliveredOrders: 23
};
