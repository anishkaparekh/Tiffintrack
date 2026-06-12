import { Router } from 'express';
import {
  createSubscription,
  getCustomerSubscriptions,
  getVendorSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getActiveSubscriptionCount
} from '../controllers/subscription.controller';

const router = Router();

// Count endpoint (must be placed before /:id to prevent route shadowing)
router.get('/count/active', getActiveSubscriptionCount);

// CRUD endpoints
router.post('/', createSubscription);
router.get('/customer/:customerId', getCustomerSubscriptions);
router.get('/vendor/:vendorId', getVendorSubscriptions);
router.get('/:id', getSubscriptionById);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);

export default router;
