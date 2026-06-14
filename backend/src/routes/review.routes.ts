import { Router } from 'express';
import {
  createReview,
  getVendorReviews,
  getCustomerReviews,
  updateReview,
  deleteReview,
  getVendorReviewStats,
} from '../controllers/review.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createReviewSchema, updateReviewSchema } from '../validations/review.validation';

const router = Router();

// Public read endpoints
router.get('/vendor/:vendorId', getVendorReviews);
router.get('/vendor/:vendorId/stats', getVendorReviewStats);
router.get('/customer/:customerId', getCustomerReviews);

// Protected mutation endpoints
router.post('/', authenticate, authorize('customer'), validate(createReviewSchema), createReview);
router.put('/:id', authenticate, authorize('customer'), validate(updateReviewSchema), updateReview);
router.delete('/:id', authenticate, authorize('customer', 'admin'), deleteReview);

export default router;
