export type OrderStatus = 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type PriorityLevel = 'High' | 'Medium' | 'On Track';

export interface OrderItem {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  mealName: string;
  plan: string;
  status: OrderStatus;
  deliveryTime: string;
  orderDate: string;
  quantity: number;
  priority: PriorityLevel;
  remainingMinutes?: number;
  deliveryInstructions?: string;
  assignedDriver?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  deliveryPartnerVehicleType?: string;
  deliveryPartnerVehicleNumber?: string;
}

export interface DeliveryScheduleItem {
  timeSlot: string;
  orderCount: number;
}

export interface OrderPerformance {
  onTimeDeliveryRate: number; // e.g. 96 for 96%
  avgPrepMinutes: number; // e.g. 28
  csatScore: number; // e.g. 4.8
}

export interface OrderStats {
  todayOrders: number;
  preparingOrders: number;
  outForDeliveryOrders: number;
  deliveredOrders: number;
}
