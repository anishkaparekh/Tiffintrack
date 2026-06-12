import { Request, Response } from 'express';
import { Plan } from '../models/Plan';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Create a new Plan (Vendor only).
 * POST /api/v1/plans
 */
export const createPlan = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  // Set vendorId from authenticated token
  const vendorId = req.user.role === 'admin' ? (req.body.vendorId || req.user.id) : req.user.id;

  const { planName, duration, mealsPerDay, price, description, isActive } = req.body;

  const plan = await Plan.create({
    vendorId,
    planName,
    duration,
    mealsPerDay,
    price,
    description,
    isActive,
  });

  res.status(201).json({
    success: true,
    message: 'Subscription plan created successfully',
    data: plan,
  });
});

/**
 * Get all plans for a specific vendor (Public).
 * GET /api/v1/plans/vendor/:vendorId
 */
export const getVendorPlans = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params;

  const plans = await Plan.find({ vendorId });

  res.status(200).json({
    success: true,
    count: plans.length,
    data: plans,
  });
});

/**
 * Get a specific plan by ID (Public).
 * GET /api/v1/plans/:id
 */
export const getPlanById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const plan = await Plan.findById(id);

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  res.status(200).json({
    success: true,
    data: plan,
  });
});

/**
 * Update a plan (Vendor / Admin only).
 * PUT /api/v1/plans/:id
 */
export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const plan = await Plan.findById(id);

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  // Check ownership: Vendor can only update their own plans
  if (req.user.role === 'vendor' && plan.vendorId.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied. You do not own this plan.');
  }

  const { planName, duration, mealsPerDay, price, description, isActive } = req.body;

  const updatedPlan = await Plan.findByIdAndUpdate(
    id,
    { planName, duration, mealsPerDay, price, description, isActive },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Subscription plan updated successfully',
    data: updatedPlan,
  });
});

/**
 * Delete a plan (Vendor / Admin only).
 * DELETE /api/v1/plans/:id
 */
export const deletePlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const plan = await Plan.findById(id);

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  // Check ownership: Vendor can only delete their own plans
  if (req.user.role === 'vendor' && plan.vendorId.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied. You do not own this plan.');
  }

  await Plan.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Subscription plan deleted successfully',
  });
});
