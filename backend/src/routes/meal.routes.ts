import { Router } from 'express';
import { createMeal, getVendorMeals, getMealById, updateMeal, deleteMeal } from '../controllers/meal.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createMealSchema, updateMealSchema } from '../validations/meal.validation';

const router = Router();

// Public read endpoints
router.get('/vendor/:vendorId', getVendorMeals);
router.get('/:id', getMealById);

// Protected mutation endpoints (Vendor / Admin only)
router.post('/', authenticate, authorize('vendor', 'admin'), validate(createMealSchema), createMeal);
router.put('/:id', authenticate, authorize('vendor', 'admin'), validate(updateMealSchema), updateMeal);
router.delete('/:id', authenticate, authorize('vendor', 'admin'), deleteMeal);

export default router;
