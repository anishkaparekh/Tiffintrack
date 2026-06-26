import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch notifications from server
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success) {
          setNotifications(resData.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success) {
          setUnreadCount(resData.count);
        }
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [token]);

  // Mark single as read
  const markAsRead = async (id) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n._id === id || n.id === id ? { ...n, isRead: true, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, isRead: true, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/v1/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const deleted = notifications.find(n => n._id === id || n.id === id);
        if (deleted && !deleted.isRead && !deleted.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        setNotifications(prev => prev.filter(n => n._id !== id && n.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  // Set up socket connection
  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect to local origin (proxy will resolve this correctly or socket.io routes directly)
    const newSocket = io(window.location.origin, {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('[Socket.IO] Connection established');
    });

    newSocket.on('notification:new', (notification) => {
      console.log('[Socket.IO] New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      
      // Trigger temporary toast
      setToast({
        id: notification._id || notification.id || Date.now(),
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        category: notification.category
      });
    });

    newSocket.on('notification:count', (data) => {
      setUnreadCount(data.count);
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected');
    });

    setSocket(newSocket);

    // Initial fetch
    fetchNotifications();
    fetchUnreadCount();

    return () => {
      newSocket.disconnect();
    };
  }, [token, fetchNotifications, fetchUnreadCount]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isLoading,
      toast,
      setToast,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
