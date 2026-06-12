import { z } from 'zod';

export const createPlanSchema = z.object({
  body: z.object({
    planName: z
      .string({ required_error: 'Plan name is required' })
      .min(2, 'Plan name must be at least 2 characters')
      .max(100, 'Plan name must not exceed 100 characters'),
    duration: z.enum(['weekly', 'monthly'], {
      required_error: 'Duration must be weekly or monthly',
    }),
    mealsPerDay: z
      .number({ required_error: 'Meals per day is required' })
      .min(1, 'Meals per day must be at least 1')
      .max(3, 'Meals per day cannot exceed 3'),
    price: z
      .number({ required_error: 'Price is required' })
      .min(0, 'Price cannot be negative'),
    description: z
      .string({ required_error: 'Description is required' })
      .min(5, 'Description must be at least 5 characters'),
    isActive: z.boolean().optional(),
  }),
});

export const updatePlanSchema = z.object({
  body: z.object({
    planName: z.string().min(2, 'Plan name must be at least 2 characters').max(100).optional(),
    duration: z.enum(['weekly', 'monthly']).optional(),
    mealsPerDay: z.number().min(1).max(3).optional(),
    price: z.number().min(0, 'Price cannot be negative').optional(),
    description: z.string().min(5, 'Description must be at least 5 characters').optional(),
    isActive: z.boolean().optional(),
  }),
});
