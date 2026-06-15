import { Router } from 'express';
import { createOrder, verifyPayment, getCustomerPayments } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/customer/:customerId', authenticate, getCustomerPayments);

export default router;
