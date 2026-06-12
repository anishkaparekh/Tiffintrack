import { Request, Response } from 'express';
import { Subscription } from '../models/Subscription';
import { User } from '../models/User';
import { Plan } from '../models/Plan';
import { Meal } from '../models/Meal';
import { Order } from '../models/Order';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Create a new subscription.
 * POST /api/v1/subscriptions
 */
export const createSubscription = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, vendorId, planId, startDate, deliveryAddress, preferences } = req.body;

  // Validate fields
  if (!customerId || !vendorId || !planId || !startDate || !deliveryAddress) {
    throw new ApiError(400, 'Customer, Vendor, Plan, Start Date, and Delivery Address are required.');
  }

  // Verify vendor exists
  const vendor = await User.findOne({ _id: vendorId, role: 'vendor' });
  if (!vendor) {
    throw new ApiError(404, 'Vendor not found.');
  }

  // Verify plan exists
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new ApiError(404, 'Plan not found.');
  }

  const sDate = new Date(startDate);
  const durationDays = plan.duration === 'weekly' ? 7 : 30;
  const eDate = new Date(sDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
  
  // mealsRemaining is mealsPerDay * durationDays
  const mealsRemaining = (plan.mealsPerDay || 1) * durationDays;

  // Find first available meal for the vendor to link the first order to
  const firstMeal = await Meal.findOne({ vendorId, availability: true });

  const subscription = await Subscription.create({
    customerId,
    vendorId,
    planId,
    vendorName: vendor.businessName || vendor.name,
    planName: plan.planName,
    status: 'Active',
    startDate: sDate,
    endDate: eDate,
    mealsRemaining: firstMeal ? mealsRemaining - 1 : mealsRemaining,
    deliveryAddress,
    preferences: preferences || [],
  });

  if (firstMeal) {
    await Order.create({
      customerId,
      vendorId,
      subscriptionId: subscription._id,
      mealId: firstMeal._id,
      orderDate: new Date(),
      deliveryDate: sDate,
      mealType: firstMeal.mealType === 'Both' ? 'Veg' : firstMeal.mealType,
      status: 'Pending',
      notes: 'Automatically generated first order'
    });
  }

  res.status(201).json({
    success: true,
    message: 'Subscription created successfully',
    data: subscription,
  });
});

/**
 * Get all subscriptions for a specific customer.
 * GET /api/v1/subscriptions/customer/:customerId
 */
export const getCustomerSubscriptions = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  const subscriptions = await Subscription.find({ customerId })
    .populate('vendorId', 'name businessName phone email')
    .populate('planId')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: subscriptions.length,
    data: subscriptions,
  });
});

/**
 * Get all subscriptions for a specific vendor.
 * GET /api/v1/subscriptions/vendor/:vendorId
 */
export const getVendorSubscriptions = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params;

  const subscriptions = await Subscription.find({ vendorId })
    .populate('customerId', 'name email phone')
    .populate('planId')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: subscriptions.length,
    data: subscriptions,
  });
});

/**
 * Get specific subscription by ID.
 * GET /api/v1/subscriptions/:id
 */
export const getSubscriptionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subscription = await Subscription.findById(id)
    .populate('customerId', 'name email phone')
    .populate('vendorId', 'name businessName phone email')
    .populate('planId');

  if (!subscription) {
    throw new ApiError(404, 'Subscription not found.');
  }

  res.status(200).json({
    success: true,
    data: subscription,
  });
});

/**
 * Update subscription.
 * PUT /api/v1/subscriptions/:id
 */
export const updateSubscription = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, mealsRemaining, deliveryAddress, preferences } = req.body;

  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw new ApiError(404, 'Subscription not found.');
  }

  if (status) {
    const validStatuses = ['Active', 'Paused', 'Expired', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    subscription.status = status;
  }

  if (mealsRemaining !== undefined) {
    if (mealsRemaining < 0) {
      throw new ApiError(400, 'Meals remaining cannot be negative.');
    }
    subscription.mealsRemaining = mealsRemaining;
  }

  if (deliveryAddress) {
    subscription.deliveryAddress = deliveryAddress;
  }

  if (preferences) {
    subscription.preferences = preferences;
  }

  await subscription.save();

  res.status(200).json({
    success: true,
    message: 'Subscription updated successfully',
    data: subscription,
  });
});

/**
 * Delete subscription.
 * DELETE /api/v1/subscriptions/:id
 */
export const deleteSubscription = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw new ApiError(404, 'Subscription not found.');
  }

  await Subscription.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Subscription deleted successfully',
  });
});

/**
 * Get active subscriptions count.
 * GET /api/v1/subscriptions/count/active
 */
export const getActiveSubscriptionCount = asyncHandler(async (_req: Request, res: Response) => {
  const count = await Subscription.countDocuments({ status: 'Active' });

  res.status(200).json({
    success: true,
    count,
  });
});
