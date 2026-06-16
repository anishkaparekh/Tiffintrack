import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getOrdersByCustomer,
  getOrdersByVendor,
  getOrdersByDeliveryPartner,
  updateOrder,
  deleteOrder,
  generateDailyOrders,
  getOrderStats
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', createOrder);
router.post('/generate-daily', generateDailyOrders);
router.get('/count/stats', getOrderStats);
router.get('/customer/:customerId', authenticate, getOrdersByCustomer);
router.get('/vendor/:vendorId', authenticate, getOrdersByVendor);
router.get('/delivery/:partnerId', authenticate, authorize('deliveryPartner', 'admin'), getOrdersByDeliveryPartner);
router.get('/:id', getOrderById);
router.put('/:id', authenticate, updateOrder);
router.delete('/:id', deleteOrder);

export default router;
