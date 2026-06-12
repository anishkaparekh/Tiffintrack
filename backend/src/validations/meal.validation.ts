import { z } from 'zod';

export const createMealSchema = z.object({
  body: z.object({
    mealName: z
      .string({ required_error: 'Meal name is required' })
      .min(2, 'Meal name must be at least 2 characters')
      .max(100, 'Meal name must not exceed 100 characters'),
    description: z
      .string({ required_error: 'Description is required' })
      .min(5, 'Description must be at least 5 characters'),
    price: z
      .number({ required_error: 'Price is required' })
      .min(0, 'Price cannot be negative'),
    mealType: z.enum(['Veg', 'Non-Veg', 'Jain', 'Both'], {
      required_error: 'Meal type must be Veg, Non-Veg, Jain, or Both',
    }),
    availability: z.boolean().optional(),
    imageUrl: z.string().optional(),
  }),
});

export const updateMealSchema = z.object({
  body: z.object({
    mealName: z.string().min(2, 'Meal name must be at least 2 characters').max(100).optional(),
    description: z.string().min(5, 'Description must be at least 5 characters').optional(),
    price: z.number().min(0, 'Price cannot be negative').optional(),
    mealType: z.enum(['Veg', 'Non-Veg', 'Jain', 'Both']).optional(),
    availability: z.boolean().optional(),
    imageUrl: z.string().optional(),
  }),
});
