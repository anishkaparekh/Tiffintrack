import { Router } from 'express';
import authRoutes from './auth.routes';
import vendorRoutes from './vendor.routes';
import mealRoutes from './meal.routes';
import planRoutes from './plan.routes';
import subscriptionRoutes from './subscription.routes';
import orderRoutes from './order.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/meals', mealRoutes);
router.use('/plans', planRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/orders', orderRoutes);
router.use('/notifications', notificationRoutes);

export default router;
