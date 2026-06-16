import { Notification } from '../models/Notification';
import { emitToUser, emitToRole } from '../utils/socket';

export class NotificationService {
  /**
   * Creates a notification, stores it in the database, and emits real-time events.
   */
  static async createNotification(data: {
    userId: string;
    userRole: 'customer' | 'vendor' | 'admin' | 'deliveryPartner';
    title: string;
    message: string;
    category: 'ORDER' | 'SUBSCRIPTION' | 'PAYMENT' | 'MEAL' | 'DELIVERY' | 'CUSTOMER' | 'VENDOR' | 'ADMIN' | 'SYSTEM' | 'PROMOTIONAL';
    type?: 'success' | 'info' | 'warning' | 'error';
    actionUrl?: string;
    metadata?: Record<string, any>;
  }) {
    const notification = await Notification.create({
      userId: data.userId,
      userRole: data.userRole,
      title: data.title,
      message: data.message,
      category: data.category,
      type: data.type || 'info',
      actionUrl: data.actionUrl,
      metadata: data.metadata || {},
      isRead: false,
    });

    // Send real-time notification to the user's private socket room
    emitToUser(data.userId, 'notification:new', notification);

    // Broadcast the updated unread notification count
    const unreadCount = await this.getUnreadCount(data.userId);
    emitToUser(data.userId, 'notification:count', { count: unreadCount });

    return notification;
  }

  /**
   * Creates a system notification targeted broadly at all administrator users.
   */
  static async createSystemNotificationForAdmins(title: string, message: string, metadata?: any) {
    const notification = await Notification.create({
      userRole: 'admin',
      title,
      message,
      category: 'SYSTEM',
      type: 'warning',
      metadata: metadata || {},
      isRead: false,
    });

    // Broadcast real-time to the admin room
    emitToRole('admin', 'notification:new', notification);
    
    // Broadcast updated unread count to admins
    const unreadCount = await this.getAdminUnreadCount();
    emitToRole('admin', 'notification:count', { count: unreadCount });

    return notification;
  }

  /**
   * Retrieves notifications list based on the user's ID or role (for admins).
   */
  static async getNotificationsByUser(userId: string, role: string) {
    // Admins view all notifications that are role: 'admin' (broad alerts + specific requests)
    const query = role === 'admin' ? { userRole: 'admin' } : { userId };
    return await Notification.find(query).sort({ createdAt: -1 });
  }

  /**
   * Marks a specific notification as read.
   */
  static async markAsRead(id: string, userId: string, role: string) {
    const query: any = role === 'admin' ? { _id: id, userRole: 'admin' } : { _id: id, userId };
    const notification = await Notification.findOneAndUpdate(
      query,
      { isRead: true },
      { new: true }
    );

    if (notification) {
      if (role === 'admin') {
        const count = await this.getAdminUnreadCount();
        emitToRole('admin', 'notification:count', { count });
      } else {
        const count = await this.getUnreadCount(userId);
        emitToUser(userId, 'notification:count', { count });
      }
    }

    return notification;
  }

  /**
   * Marks all unread notifications as read.
   */
  static async markAllAsRead(userId: string, role: string) {
    const query: any = role === 'admin' 
      ? { userRole: 'admin', isRead: false } 
      : { userId, isRead: false };

    await Notification.updateMany(query, { isRead: true });

    if (role === 'admin') {
      emitToRole('admin', 'notification:count', { count: 0 });
    } else {
      emitToUser(userId, 'notification:count', { count: 0 });
    }
  }

  /**
   * Deletes a notification from storage.
   */
  static async deleteNotification(id: string, userId: string, role: string) {
    const query: any = role === 'admin' ? { _id: id, userRole: 'admin' } : { _id: id, userId };
    const notification = await Notification.findOneAndDelete(query);

    if (notification && !notification.isRead) {
      if (role === 'admin') {
        const count = await this.getAdminUnreadCount();
        emitToRole('admin', 'notification:count', { count });
      } else {
        const count = await this.getUnreadCount(userId);
        emitToUser(userId, 'notification:count', { count });
      }
    }

    return notification;
  }

  /**
   * Retrieves the count of unread notifications for a specific user.
   */
  static async getUnreadCount(userId: string): Promise<number> {
    return await Notification.countDocuments({ userId, isRead: false });
  }

  /**
   * Retrieves the count of unread system/admin notifications.
   */
  static async getAdminUnreadCount(): Promise<number> {
    return await Notification.countDocuments({ userRole: 'admin', isRead: false });
  }
}
