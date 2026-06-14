import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

/**
 * Retrieves the notifications list for the active user.
 */
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const role = req.user?.role;

  if (!userId || !role) {
    throw new ApiError(401, 'Unauthorized access: user parameters missing');
  }

  const notifications = await NotificationService.getNotificationsByUser(userId, role);

  res.status(200).json({
    success: true,
    data: notifications,
  });
});

/**
 * Marks a specific notification as read.
 */
export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const role = req.user?.role;

  if (!userId || !role) {
    throw new ApiError(401, 'Unauthorized access');
  }

  const notification = await NotificationService.markAsRead(id, userId, role);
  if (!notification) {
    throw new ApiError(404, 'Notification not found or access denied');
  }

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

/**
 * Marks all notifications as read.
 */
export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const role = req.user?.role;

  if (!userId || !role) {
    throw new ApiError(401, 'Unauthorized access');
  }

  await NotificationService.markAllAsRead(userId, role);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});

/**
 * Deletes a notification.
 */
export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const role = req.user?.role;

  if (!userId || !role) {
    throw new ApiError(401, 'Unauthorized access');
  }

  const notification = await NotificationService.deleteNotification(id, userId, role);
  if (!notification) {
    throw new ApiError(404, 'Notification not found or access denied');
  }

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});

/**
 * Retrieves the count of unread notifications for the active user.
 */
export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const role = req.user?.role;

  if (!userId || !role) {
    throw new ApiError(401, 'Unauthorized access');
  }

  const count = role === 'admin' 
    ? await NotificationService.getAdminUnreadCount() 
    : await NotificationService.getUnreadCount(userId);

  res.status(200).json({
    success: true,
    count,
  });
});
