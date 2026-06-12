import { Router } from 'express';
import { createPlan, getVendorPlans, getPlanById, updatePlan, deletePlan } from '../controllers/plan.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createPlanSchema, updatePlanSchema } from '../validations/plan.validation';

const router = Router();

// Public read endpoints
router.get('/vendor/:vendorId', getVendorPlans);
router.get('/:id', getPlanById);

// Protected mutation endpoints (Vendor / Admin only)
router.post('/', authenticate, authorize('vendor', 'admin'), validate(createPlanSchema), createPlan);
router.put('/:id', authenticate, authorize('vendor', 'admin'), validate(updatePlanSchema), updatePlan);
router.delete('/:id', authenticate, authorize('vendor', 'admin'), deletePlan);

export default router;
