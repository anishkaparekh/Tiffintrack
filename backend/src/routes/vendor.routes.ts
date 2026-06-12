import { Router } from 'express';
import { getApprovedVendors, getAllVendors, verifyVendor, getVendorById } from '../controllers/vendor.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public: Get only approved vendors (visible to customers)
router.get('/', getApprovedVendors);

// Admin Only: Get all vendors (including pending/rejected)
router.get('/all', authenticate, authorize('admin'), getAllVendors);

// Public: Get vendor by ID
router.get('/:id', getVendorById);

// Admin Only: Verify vendor status
router.patch('/:id/verify', authenticate, authorize('admin'), verifyVendor);

export default router;
