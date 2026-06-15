import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DeliveryAssignment, 
  getStoredDeliveries, 
  saveDeliveries,
  getStoredPartners,
  savePartners,
  DeliveryPartner
} from '../../../data/vendorDeliveryMockData';

export interface ActivityLog {
  id: string;
  orderId: string;
  customerName: string;
  status: string;
  timestamp: string;
  deliveryPartner: string;
}

export interface WorkflowNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  role: 'customer' | 'vendor' | 'delivery';
  timestamp: string;
  isRead: boolean;
}

interface DeliveryWorkflowContextType {
  deliveries: DeliveryAssignment[];
  partners: DeliveryPartner[];
  activityLogs: ActivityLog[];
  notifications: WorkflowNotification[];
  updateDeliveryStatus: (orderId: string, status: DeliveryAssignment['status'], reason?: string | null) => void;
  addNotification: (notification: Omit<WorkflowNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  clearAll: () => void;
}

const DeliveryWorkflowContext = createContext<DeliveryWorkflowContextType | undefined>(undefined);

export function useDeliveryWorkflow() {
  const context = useContext(DeliveryWorkflowContext);
  if (!context) {
    throw new Error('useDeliveryWorkflow must be used within a DeliveryWorkflowProvider');
  }
  return context;
}

export default function DeliveryWorkflowProvider({ children }: { children: React.ReactNode }) {
  const [deliveries, setDeliveries] = useState<DeliveryAssignment[]>([]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<WorkflowNotification[]>([]);

  // Initialize state from localStorage
  useEffect(() => {
    setDeliveries(getStoredDeliveries());
    setPartners(getStoredPartners());

    const storedLogs = localStorage.getItem('delivery_activity_logs');
    if (storedLogs) {
      setActivityLogs(JSON.parse(storedLogs));
    } else {
      const initialLogs: ActivityLog[] = [
        {
          id: "act-1",
          orderId: "OD-5011",
          customerName: "Hardik Pandya",
          status: "Assigned",
          timestamp: "Today, 10:15 AM",
          deliveryPartner: "Rahul Patel"
        },
        {
          id: "act-2",
          orderId: "OD-5012",
          customerName: "Pooja Jadeja",
          status: "Preparing",
          timestamp: "Today, 11:30 AM",
          deliveryPartner: "Rahul Patel"
        }
      ];
      setActivityLogs(initialLogs);
      localStorage.setItem('delivery_activity_logs', JSON.stringify(initialLogs));
    }

    const storedNotifs = localStorage.getItem('delivery_workflow_notifications');
    if (storedNotifs) {
      setNotifications(JSON.parse(storedNotifs));
    } else {
      const initialNotifs: WorkflowNotification[] = [
        {
          id: "not-1",
          title: "New Delivery Assigned",
          message: "Order OD-5011 assigned to Rahul Patel",
          type: "info",
          role: "delivery",
          timestamp: "Today, 10:15 AM",
          isRead: false
        },
        {
          id: "not-2",
          title: "Meal Prepared",
          message: "🍱 Your meal is freshly prepared for Pooja Jadeja.",
          type: "success",
          role: "customer",
          timestamp: "Today, 11:30 AM",
          isRead: false
        }
      ];
      setNotifications(initialNotifs);
      localStorage.setItem('delivery_workflow_notifications', JSON.stringify(initialNotifs));
    }
  }, []);

  const updateDeliveryStatus = (
    orderId: string, 
    status: DeliveryAssignment['status'], 
    reason: string | null = null
  ) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = "Today, " + timeStr;

    // 1. Update deliveries
    const updatedDeliveries = deliveries.map(d => {
      if (d.id === orderId) {
        return { ...d, status, failReason: reason || undefined };
      }
      return d;
    });
    setDeliveries(updatedDeliveries);
    saveDeliveries(updatedDeliveries);

    const targetOrder = deliveries.find(d => d.id === orderId);
    if (!targetOrder) return;

    const partnerName = targetOrder.assignedPartnerName || "Rahul Patel";
    const partnerId = targetOrder.assignedPartnerId || "DP-001";

    // 2. Add Activity Log
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      orderId,
      customerName: targetOrder.customerName,
      status,
      timestamp: dateStr,
      deliveryPartner: partnerName
    };
    const nextLogs = [newLog, ...activityLogs];
    setActivityLogs(nextLogs);
    localStorage.setItem('delivery_activity_logs', JSON.stringify(nextLogs));

    // 3. Generate Notifications based on status
    const newNotifications: WorkflowNotification[] = [];

    // Customer notifications
    if (status === 'Preparing') {
      newNotifications.push({
        id: `not-cust-${Date.now()}`,
        title: "Meal Prepared",
        message: `🍱 Your meal is freshly prepared at ${targetOrder.assignedPartnerName || 'Vendor Kitchen'}.`,
        type: 'success',
        role: 'customer',
        timestamp: dateStr,
        isRead: false
      });
    } else if (status === 'Out for Delivery') {
      newNotifications.push({
        id: `not-cust-${Date.now()}`,
        title: "Tiffin On The Way",
        message: `🚴 Your tiffin is on the way with partner ${partnerName}.`,
        type: 'info',
        role: 'customer',
        timestamp: dateStr,
        isRead: false
      });
    } else if (status === 'Delivered') {
      newNotifications.push({
        id: `not-cust-${Date.now()}`,
        title: "Homemade Meal Arrived",
        message: "❤️ Your homemade meal has arrived! Enjoy your warm thali.",
        type: 'success',
        role: 'customer',
        timestamp: dateStr,
        isRead: false
      });
    } else if (status === 'Failed') {
      newNotifications.push({
        id: `not-cust-${Date.now()}`,
        title: "Delivery Attempt Failed",
        message: `⚠️ Delivery attempt failed: ${reason || 'Customer Unavailable'}.`,
        type: 'error',
        role: 'customer',
        timestamp: dateStr,
        isRead: false
      });
    }

    // Vendor notifications
    if (status === 'Delivered') {
      newNotifications.push({
        id: `not-vend-${Date.now()}`,
        title: "Delivery Completed",
        message: `Delivery completed successfully for order ${orderId} (${targetOrder.customerName}).`,
        type: 'success',
        role: 'vendor',
        timestamp: dateStr,
        isRead: false
      });
    } else if (status === 'Failed') {
      newNotifications.push({
        id: `not-vend-${Date.now()}`,
        title: "Delivery Failed",
        message: `Delivery failed for order ${orderId}. Reason: ${reason || 'Customer Unavailable'}.`,
        type: 'error',
        role: 'vendor',
        timestamp: dateStr,
        isRead: false
      });
    }

    // Update workload if status moves to final
    if (status === 'Delivered' || status === 'Failed') {
      const updatedPartners = partners.map(p => {
        if (p.id === partnerId) {
          return { ...p, todayDeliveriesCount: Math.max(0, p.todayDeliveriesCount - 1) };
        }
        return p;
      });
      setPartners(updatedPartners);
      savePartners(updatedPartners);
    }

    if (newNotifications.length > 0) {
      const nextNotifs = [...newNotifications, ...notifications];
      setNotifications(nextNotifs);
      localStorage.setItem('delivery_workflow_notifications', JSON.stringify(nextNotifs));
    }
  };

  const addNotification = (notification: Omit<WorkflowNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newNotif: WorkflowNotification = {
      ...notification,
      id: `not-${Date.now()}`,
      timestamp: "Today, " + timeStr,
      isRead: false
    };
    const nextNotifs = [newNotif, ...notifications];
    setNotifications(nextNotifs);
    localStorage.setItem('delivery_workflow_notifications', JSON.stringify(nextNotifs));
  };

  const clearAll = () => {
    localStorage.removeItem('delivery_activity_logs');
    localStorage.removeItem('delivery_workflow_notifications');
    localStorage.removeItem('vendor_deliveries');
    localStorage.removeItem('vendor_delivery_partners');
    
    setDeliveries(getStoredDeliveries());
    setPartners(getStoredPartners());
    setActivityLogs([]);
    setNotifications([]);
  };

  return (
    <DeliveryWorkflowContext.Provider value={{
      deliveries,
      partners,
      activityLogs,
      notifications,
      updateDeliveryStatus,
      addNotification,
      clearAll
    }}>
      {children}
    </DeliveryWorkflowContext.Provider>
  );
}
