import { Router } from 'express';
import {
  createAddress,
  getCustomerAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/address.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createAddressSchema, updateAddressSchema } from '../validations/address.validation';

const router = Router();

// All address routes require authentication
router.use(authenticate);

// CRUD routes
router.post('/', authorize('customer'), validate(createAddressSchema), createAddress);
router.get('/customer/:customerId', getCustomerAddresses);
router.put('/:id', authorize('customer'), validate(updateAddressSchema), updateAddress);
router.delete('/:id', authorize('customer', 'admin'), deleteAddress);
router.patch('/:id/default', authorize('customer'), setDefaultAddress);

export default router;
