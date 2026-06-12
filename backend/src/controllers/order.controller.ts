import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Meal } from '../models/Meal';
import { Subscription } from '../models/Subscription';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Create a new order.
 * POST /api/v1/orders
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, vendorId, subscriptionId, mealId, orderDate, deliveryDate, mealType, status, notes } = req.body;

  // Validate required fields
  if (!customerId || !vendorId || !mealId || !deliveryDate || !mealType) {
    throw new ApiError(400, 'Customer ID, Vendor ID, Meal ID, Delivery Date, and Meal Type are required.');
  }

  // Verify customer exists and has customer role
  const customer = await User.findOne({ _id: customerId, role: 'customer' });
  if (!customer) {
    throw new ApiError(404, 'Customer not found.');
  }

  // Verify vendor exists and has vendor role
  const vendor = await User.findOne({ _id: vendorId, role: 'vendor' });
  if (!vendor) {
    throw new ApiError(404, 'Vendor not found.');
  }

  // Verify meal exists
  const meal = await Meal.findById(mealId);
  if (!meal) {
    throw new ApiError(404, 'Meal not found.');
  }

  // If subscriptionId is provided, verify it exists
  if (subscriptionId) {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new ApiError(404, 'Subscription not found.');
    }
  }

  const order = await Order.create({
    customerId,
    vendorId,
    subscriptionId,
    mealId,
    orderDate: orderDate ? new Date(orderDate) : new Date(),
    deliveryDate: new Date(deliveryDate),
    mealType,
    status: status || 'Pending',
    notes: notes || '',
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

/**
 * Get specific order by ID.
 * GET /api/v1/orders/:id
 */
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('customerId', 'name email phone')
    .populate('vendorId', 'name businessName phone email')
    .populate('mealId')
    .populate('subscriptionId');

  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * Get all orders for a specific customer.
 * GET /api/v1/orders/customer/:customerId
 */
export const getOrdersByCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  const orders = await Order.find({ customerId })
    .populate('vendorId', 'name businessName phone email')
    .populate('mealId')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * Get all orders for a specific vendor.
 * GET /api/v1/orders/vendor/:vendorId
 */
export const getOrdersByVendor = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params;

  const orders = await Order.find({ vendorId })
    .populate('customerId', 'name email phone')
    .populate('mealId')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * Update an order.
 * PUT /api/v1/orders/:id
 */
export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, deliveryDate, notes, mealId } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  if (status) {
    const validStatuses = ['Pending', 'Preparing', 'Out For Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    order.status = status;
  }

  if (deliveryDate) {
    order.deliveryDate = new Date(deliveryDate);
  }

  if (notes !== undefined) {
    order.notes = notes;
  }

  if (mealId) {
    const meal = await Meal.findById(mealId);
    if (!meal) {
      throw new ApiError(404, 'Meal not found.');
    }
    order.mealId = mealId;
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    data: order,
  });
});

/**
 * Delete an order.
 * DELETE /api/v1/orders/:id
 */
export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  await Order.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully',
  });
});

/**
 * Automatically generate daily orders from active subscriptions.
 * POST /api/v1/orders/generate-daily
 */
export const generateDailyOrders = asyncHandler(async (req: Request, res: Response) => {
  const { date } = req.body;
  
  // Parse target date (default to tomorrow)
  const targetDate = date ? new Date(date) : new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Find all active subscriptions with meals remaining
  const activeSubscriptions = await Subscription.find({
    status: 'Active',
    mealsRemaining: { $gt: 0 }
  });

  const generatedCount = [];

  for (const sub of activeSubscriptions) {
    // Check if an order already exists for this subscription and targetDate (just date portion)
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingOrder = await Order.findOne({
      subscriptionId: sub._id,
      deliveryDate: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!existingOrder) {
      // Find a meal from this vendor
      const meal = await Meal.findOne({ vendorId: sub.vendorId, availability: true });
      if (meal) {
        const order = await Order.create({
          customerId: sub.customerId,
          vendorId: sub.vendorId,
          subscriptionId: sub._id,
          mealId: meal._id,
          orderDate: new Date(),
          deliveryDate: targetDate,
          mealType: meal.mealType === 'Both' ? 'Veg' : meal.mealType,
          status: 'Pending',
          notes: 'Daily subscription order'
        });

        sub.mealsRemaining = sub.mealsRemaining - 1;
        await sub.save();
        generatedCount.push(order);
      }
    }
  }

  res.status(200).json({
    success: true,
    message: `Generated ${generatedCount.length} daily orders successfully.`,
    count: generatedCount.length,
    data: generatedCount
  });
});

/**
 * Get count statistics of all, Pending, and Delivered orders.
 * GET /api/v1/orders/count/stats
 */
export const getOrderStats = asyncHandler(async (_req: Request, res: Response) => {
  const totalOrders = await Order.countDocuments({});
  const pendingOrders = await Order.countDocuments({ status: 'Pending' });
  const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      pendingOrders,
      deliveredOrders
    }
  });
});
