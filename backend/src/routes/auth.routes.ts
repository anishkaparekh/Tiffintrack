import { Router } from 'express';
import { register, login, logout, getMe, deliveryRegister, deliveryLogin } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, deliveryRegisterSchema } from '../validations/auth.validation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

// Delivery partner routes
router.post('/delivery/register', validate(deliveryRegisterSchema), deliveryRegister);
router.post('/delivery/login', validate(loginSchema), deliveryLogin);

export default router;
