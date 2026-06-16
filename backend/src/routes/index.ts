import { Router } from 'express';
import authRoutes from './auth.routes';
import vendorRoutes from './vendor.routes';
import mealRoutes from './meal.routes';
import planRoutes from './plan.routes';
import subscriptionRoutes from './subscription.routes';
import orderRoutes from './order.routes';
import reviewRoutes from './review.routes';
import notificationRoutes from './notification.routes';
import addressRoutes from './address.routes';
import paymentRoutes from './payment.routes';
import deliveryRoutes from './delivery.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/meals', mealRoutes);
router.use('/plans', planRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/addresses', addressRoutes);
router.use('/payments', paymentRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/delivery-partner', deliveryRoutes);
router.use('/customer', deliveryRoutes);

export default router;
