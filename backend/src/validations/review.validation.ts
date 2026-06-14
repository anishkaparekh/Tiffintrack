import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    vendorId: z.string({ required_error: 'Vendor ID is required' }),
    subscriptionId: z.string().optional(),
    orderId: z.string().optional(),
    rating: z
      .number({ required_error: 'Rating is required' })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    reviewText: z
      .string({ required_error: 'Review text is required' })
      .min(3, 'Review text must be at least 3 characters')
      .max(500, 'Review text must not exceed 500 characters'),
  }).refine((data) => data.subscriptionId || data.orderId, {
    message: 'Either subscriptionId or orderId must be provided to write a review',
    path: ['subscriptionId'],
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5')
      .optional(),
    reviewText: z
      .string()
      .min(3, 'Review text must be at least 3 characters')
      .max(500, 'Review text must not exceed 500 characters')
      .optional(),
  }),
});
