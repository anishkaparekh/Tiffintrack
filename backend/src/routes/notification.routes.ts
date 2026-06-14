import { Router } from 'express';
import {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  getUnreadCount,
} from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Require JWT authentication for all notification endpoints
router.use(authenticate);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);
router.delete('/:id', deleteNotification);

export default router;
