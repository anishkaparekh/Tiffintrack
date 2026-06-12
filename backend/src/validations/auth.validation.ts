import { z } from 'zod';
import { ROLES } from '../constants/roles';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
    role: z
      .enum([ROLES.CUSTOMER, ROLES.VENDOR, ROLES.ADMIN], {
        errorMap: () => ({ message: 'Role must be customer, vendor, or admin' }),
      })
      .optional()
      .default(ROLES.CUSTOMER),
    phone: z.string().optional(),
    businessName: z.string().optional(),
    kitchenAddress: z.string().optional(),
    city: z.string().optional(),
    mealsPerDay: z.union([z.string(), z.number()]).optional(),
    description: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address'),
    password: z
      .string({
        required_error: 'Password is required',
      }),
  }),
});
