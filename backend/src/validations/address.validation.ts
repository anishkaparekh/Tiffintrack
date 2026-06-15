import { z } from 'zod';

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Name must be at least 2 characters'),
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .min(10, 'Phone number must be at least 10 digits'),
    addressLine1: z
      .string({ required_error: 'Address line 1 is required' })
      .min(3, 'Address line 1 is too short'),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    city: z
      .string({ required_error: 'City is required' })
      .min(2, 'City name is too short'),
    state: z
      .string({ required_error: 'State is required' })
      .min(2, 'State name is too short'),
    pincode: z
      .string({ required_error: 'Pincode is required' })
      .min(6, 'Pincode must be at least 6 characters'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
    addressLine1: z.string().min(3, 'Address line 1 is too short').optional(),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().min(2, 'City name is too short').optional(),
    state: z.string().min(2, 'State name is too short').optional(),
    pincode: z.string().min(6, 'Pincode must be at least 6 characters').optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    isDefault: z.boolean().optional(),
  }),
});
