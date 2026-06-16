import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Meal } from '../models/Meal';
import { Subscription } from '../models/Subscription';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { NotificationService } from '../services/notification.service';

/**
 * Create a new order.
 * POST /api/v1/orders
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, vendorId, subscriptionId, deliveryPartnerId, mealId, orderDate, deliveryDate, mealType, status, notes } = req.body;

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
    deliveryPartnerId,
    mealId,
    orderDate: orderDate ? new Date(orderDate) : new Date(),
    deliveryDate: new Date(deliveryDate),
    mealType,
    status: status || 'Pending',
    notes: notes || '',
  });

  // Fetch details for personalized messages
  const vendorName = vendor.businessName || vendor.name || 'Chef';

  // 1. Customer Notification (Warm food reminder)
  await NotificationService.createNotification({
    userId: customerId,
    userRole: 'customer',
    title: '☀️ Good Morning! Wholesome Goodness Preparing',
    message: `Your delicious tiffin from ${vendorName} is being lovingly prepared for today!`,
    category: 'ORDER',
    type: 'info',
  });

  // 2. Vendor Notification (Motivational reminder)
  await NotificationService.createNotification({
    userId: vendorId,
    userRole: 'vendor',
    title: '🍲 New Order Received!',
    message: `You've got a new order waiting. Time to spread some homemade happiness!`,
    category: 'ORDER',
    type: 'success',
  });

  // 3. Optional Delivery Partner assignment notifications
  if (deliveryPartnerId) {
    const rider = await User.findById(deliveryPartnerId);
    if (rider) {
      const riderName = rider.name || 'Rider';
      const riderPhone = rider.phone || '';
      const orderShortId = order._id.toString().slice(-6).toUpperCase();
      const customerName = customer?.name || 'Customer';

      // Customer: Delivery partner assigned
      await NotificationService.createNotification({
        userId: customerId,
        userRole: 'customer',
        title: '🚴 Delivery Partner Assigned',
        message: `Your tiffin drop-off is assigned to ${riderName} (${riderPhone}).`,
        category: 'DELIVERY',
        type: 'info',
      });

      // Vendor: Delivery accepted / partner assigned
      await NotificationService.createNotification({
        userId: vendorId,
        userRole: 'vendor',
        title: '🏍️ Delivery Partner Assigned',
        message: `Rider ${riderName} is assigned to pick up Order #${orderShortId}.`,
        category: 'DELIVERY',
        type: 'info',
      });

      // Delivery Partner: New delivery assigned
      await NotificationService.createNotification({
        userId: deliveryPartnerId,
        userRole: 'deliveryPartner',
        title: '📦 New Delivery Assigned',
        message: `You have been assigned Order #${orderShortId} from ${vendorName} to ${customerName}.`,
        category: 'DELIVERY',
        type: 'info',
        actionUrl: `/delivery-dashboard`,
      });
    }
  }

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
    .populate('subscriptionId')
    .populate('deliveryPartnerId', 'name email phone vehicleType vehicleNumber');

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
    .populate('deliveryPartnerId', 'name email phone vehicleType vehicleNumber')
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
    .populate('subscriptionId')
    .populate('deliveryPartnerId', 'name email phone vehicleType vehicleNumber')
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
  const { status, deliveryDate, notes, mealId, deliveryPartnerId } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  if (status) {
    const validStatuses = ['Pending', 'Preparing', 'Out For Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const oldStatus = order.status;
    order.status = status;

    if (oldStatus !== status) {
      const vendorUser = await User.findById(order.vendorId);
      const vendorName = vendorUser?.businessName || vendorUser?.name || 'Chef';
      const orderShortId = order._id.toString().slice(-6).toUpperCase();
      const customerUser = await User.findById(order.customerId);
      const customerName = customerUser?.name || 'Customer';
      
      const riderUser = order.deliveryPartnerId ? await User.findById(order.deliveryPartnerId) : null;
      const riderName = riderUser?.name || 'your rider';

      if (status === 'Preparing') {
        // Customer Notification
        await NotificationService.createNotification({
          userId: order.customerId.toString(),
          userRole: 'customer',
          title: '❤️ Meal is Being Prepared',
          message: `Your meal from ${vendorName} is being prepared with care!`,
          category: 'MEAL',
          type: 'info',
        });
        // Vendor Notification
        await NotificationService.createNotification({
          userId: order.vendorId.toString(),
          userRole: 'vendor',
          title: '🍳 Preparation Started',
          message: `You marked Order #${orderShortId} as preparing.`,
          category: 'MEAL',
          type: 'info',
        });
      } else if (status === 'Out For Delivery') {
        // Customer Notification
        await NotificationService.createNotification({
          userId: order.customerId.toString(),
          userRole: 'customer',
          title: '🍱 Lunch Ready & En Route!',
          message: `Hurray! Your freshly made meal from ${vendorName} is ready and on its way to you with ${riderName}!`,
          category: 'DELIVERY',
          type: 'success',
        });
        // Vendor Notification
        await NotificationService.createNotification({
          userId: order.vendorId.toString(),
          userRole: 'vendor',
          title: '🏍️ Order Dispatched',
          message: `Order #${orderShortId} is marked out for delivery with ${riderName}.`,
          category: 'DELIVERY',
          type: 'success',
        });
      } else if (status === 'Delivered') {
        // Customer Notification
        await NotificationService.createNotification({
          userId: order.customerId.toString(),
          userRole: 'customer',
          title: '🏠 Fresh Meal Delivered!',
          message: `Your homemade meal has arrived. Your meal from ${vendorName} was delivered by ${riderName}!`,
          category: 'DELIVERY',
          type: 'success',
        });
        // Vendor Notification
        await NotificationService.createNotification({
          userId: order.vendorId.toString(),
          userRole: 'vendor',
          title: '🌟 Delivery Completed Successfully!',
          message: `Order #${orderShortId} has been successfully delivered to ${customerName} by ${riderName}.`,
          category: 'DELIVERY',
          type: 'success',
        });
      } else if (status === 'Cancelled') {
        // Customer Notification
        await NotificationService.createNotification({
          userId: order.customerId.toString(),
          userRole: 'customer',
          title: '⚠️ Order Cancelled',
          message: `We regret to inform you that your order from ${vendorName} has been cancelled.`,
          category: 'ORDER',
          type: 'error',
        });
        // Vendor Notification
        await NotificationService.createNotification({
          userId: order.vendorId.toString(),
          userRole: 'vendor',
          title: '⚠️ Order Cancelled',
          message: `Order #${orderShortId} has been cancelled.`,
          category: 'ORDER',
          type: 'error',
        });
      }
    }
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

  if (deliveryPartnerId !== undefined) {
    const oldPartnerId = order.deliveryPartnerId?.toString();
    order.deliveryPartnerId = deliveryPartnerId || undefined;
    const newPartnerId = deliveryPartnerId ? deliveryPartnerId.toString() : '';
    if (newPartnerId && newPartnerId !== oldPartnerId) {
      // Fetch details
      const rider = await User.findById(deliveryPartnerId);
      if (rider) {
        const customerUser = await User.findById(order.customerId);
        const vendorUser = await User.findById(order.vendorId);
        
        const riderName = rider.name || 'Rider';
        const riderPhone = rider.phone || '';
        const orderShortId = order._id.toString().slice(-6).toUpperCase();
        const vendorName = vendorUser?.businessName || vendorUser?.name || 'Chef';
        const customerName = customerUser?.name || 'Customer';

        // 1. Customer: Delivery partner assigned
        await NotificationService.createNotification({
          userId: order.customerId.toString(),
          userRole: 'customer',
          title: '🚴 Delivery Partner Assigned',
          message: `Your tiffin drop-off is assigned to ${riderName} (${riderPhone}).`,
          category: 'DELIVERY',
          type: 'info',
        });

        // 2. Vendor: Delivery accepted / partner assigned
        await NotificationService.createNotification({
          userId: order.vendorId.toString(),
          userRole: 'vendor',
          title: '🏍️ Delivery Partner Assigned',
          message: `Rider ${riderName} is assigned to pick up Order #${orderShortId}.`,
          category: 'DELIVERY',
          type: 'info',
        });

        // 3. Delivery Partner: New delivery assigned
        await NotificationService.createNotification({
          userId: deliveryPartnerId,
          userRole: 'deliveryPartner',
          title: '📦 New Delivery Assigned',
          message: `You have been assigned Order #${orderShortId} from ${vendorName} to ${customerName}.`,
          category: 'DELIVERY',
          type: 'info',
          actionUrl: `/delivery-dashboard`,
        });
      }
    }
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

/**
 * Get all orders for a specific delivery partner.
 * GET /api/v1/orders/delivery/:partnerId
 */
export const getOrdersByDeliveryPartner = asyncHandler(async (req: Request, res: Response) => {
  const { partnerId } = req.params;

  const orders = await Order.find({ deliveryPartnerId: partnerId })
    .populate('customerId', 'name email phone')
    .populate('vendorId', 'name businessName phone email kitchenAddress city')
    .populate('mealId')
    .populate('subscriptionId')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});
