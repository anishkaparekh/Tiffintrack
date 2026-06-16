import { Router } from 'express';
import { createOrder, verifyPayment, getCustomerPayments, getVendorPayments } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/customer/:customerId', authenticate, getCustomerPayments);
router.get('/vendor/:vendorId', authenticate, getVendorPayments);

export default router;
