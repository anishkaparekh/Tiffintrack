import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getOrdersByCustomer,
  getOrdersByVendor,
  updateOrder,
  deleteOrder,
  generateDailyOrders,
  getOrderStats
} from '../controllers/order.controller';

const router = Router();

router.post('/', createOrder);
router.post('/generate-daily', generateDailyOrders);
router.get('/count/stats', getOrderStats);
router.get('/customer/:customerId', getOrdersByCustomer);
router.get('/vendor/:vendorId', getOrdersByVendor);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
