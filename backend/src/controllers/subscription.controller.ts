import { Request, Response } from 'express';
import { Subscription } from '../models/Subscription';
import { User } from '../models/User';
import { Plan } from '../models/Plan';
import { Meal } from '../models/Meal';
import { Order } from '../models/Order';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { NotificationService } from '../services/notification.service';

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

  // Fetch customer details for vendor notification
  const customerUser = await User.findById(customerId);

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

  // 1. Customer Notification (Homely Renewal/Purchase message)
  await NotificationService.createNotification({
    userId: customerId,
    userRole: 'customer',
    title: '🌼 Wholesome Meals Await You!',
    message: `Thanks for staying with us. Another period of wholesome meals from ${vendor.businessName || vendor.name} is scheduled for you!`,
    category: 'SUBSCRIPTION',
    type: 'success',
  });

  // 2. Vendor Notification (Motivational message)
  await NotificationService.createNotification({
    userId: vendorId,
    userRole: 'vendor',
    title: '❤️ Another Family Chose You Today!',
    message: `A new customer (${customerUser?.name || 'Home Food Lover'}) purchased your plan "${plan.planName}". Thank you for serving with care!`,
    category: 'SUBSCRIPTION',
    type: 'success',
  });

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

    const oldStatus = subscription.status;
    subscription.status = status;

    // Trigger alerts on status transitions
    if (oldStatus !== status) {
      if (status === 'Paused') {
        // Customer Alert
        await NotificationService.createNotification({
          userId: subscription.customerId.toString(),
          userRole: 'customer',
          title: '⏸️ Subscription Paused',
          message: `Your meal plan from ${subscription.vendorName} has been paused. Tiffin drop-offs are suspended until you resume.`,
          category: 'SUBSCRIPTION',
          type: 'info',
        });
        // Vendor Alert
        await NotificationService.createNotification({
          userId: subscription.vendorId.toString(),
          userRole: 'vendor',
          title: '⏸️ Subscription Paused by Customer',
          message: `A customer has paused their subscription for your plan "${subscription.planName}".`,
          category: 'SUBSCRIPTION',
          type: 'info',
        });
      } else if (status === 'Active') {
        // Customer Alert
        await NotificationService.createNotification({
          userId: subscription.customerId.toString(),
          userRole: 'customer',
          title: '▶️ Subscription Resumed',
          message: `Welcome back! Your subscription to ${subscription.vendorName} is active again. Wholesome home-cooked goodness is on its way.`,
          category: 'SUBSCRIPTION',
          type: 'success',
        });
        // Vendor Alert
        await NotificationService.createNotification({
          userId: subscription.vendorId.toString(),
          userRole: 'vendor',
          title: '▶️ Subscription Resumed by Customer',
          message: `A customer has resumed their subscription for your plan "${subscription.planName}".`,
          category: 'SUBSCRIPTION',
          type: 'success',
        });
      } else if (status === 'Cancelled') {
        // Customer Alert
        await NotificationService.createNotification({
          userId: subscription.customerId.toString(),
          userRole: 'customer',
          title: '🛑 Subscription Cancelled',
          message: `Your subscription to ${subscription.vendorName} has been cancelled. We're sorry to see you go!`,
          category: 'SUBSCRIPTION',
          type: 'warning',
        });
        // Vendor Alert
        await NotificationService.createNotification({
          userId: subscription.vendorId.toString(),
          userRole: 'vendor',
          title: '🛑 Subscription Cancelled by Customer',
          message: `A customer has cancelled their subscription for your plan "${subscription.planName}".`,
          category: 'SUBSCRIPTION',
          type: 'warning',
        });
      }
    }
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
