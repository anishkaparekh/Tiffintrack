import { Request, Response } from 'express';
import { Delivery } from '../models/Delivery';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { NotificationService } from '../services/notification.service';

/**
 * Helper to get today's start and end date bounds.
 */
const getTodayBounds = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// ==========================================
// VENDOR DASHBOARD APIS
// ==========================================

/**
 * GET: Today's Deliveries for a Vendor
 * GET /api/v1/deliveries/vendor/today
 */
export const getVendorTodayDeliveries = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const { start, end } = getTodayBounds();

  const deliveries = await Delivery.find({
    vendorId,
    deliveryDate: { $gte: start, $lte: end }
  })
    .populate('customerId', 'name email phone')
    .populate('deliveryPartnerId', 'name phone email')
    .populate('subscriptionId')
    .sort({ deliveryTime: 1 });

  res.status(200).json({
    success: true,
    count: deliveries.length,
    data: deliveries,
  });
});

/**
 * GET: Unassigned Deliveries for a Vendor
 * GET /api/v1/deliveries/vendor/unassigned
 */
export const getVendorUnassignedDeliveries = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const deliveries = await Delivery.find({
    vendorId,
    status: 'pending'
  })
    .populate('customerId', 'name email phone')
    .populate('subscriptionId')
    .sort({ deliveryDate: 1, deliveryTime: 1 });

  res.status(200).json({
    success: true,
    count: deliveries.length,
    data: deliveries,
  });
});

/**
 * GET: Assigned Deliveries for a Vendor
 * GET /api/v1/deliveries/vendor/assigned
 */
export const getVendorAssignedDeliveries = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const deliveries = await Delivery.find({
    vendorId,
    status: 'assigned'
  })
    .populate('customerId', 'name email phone')
    .populate('deliveryPartnerId', 'name phone email')
    .populate('subscriptionId')
    .sort({ deliveryDate: 1, deliveryTime: 1 });

  res.status(200).json({
    success: true,
    count: deliveries.length,
    data: deliveries,
  });
});

/**
 * GET: Delivered Deliveries for a Vendor
 * GET /api/v1/deliveries/vendor/delivered
 */
export const getVendorDeliveredDeliveries = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const deliveries = await Delivery.find({
    vendorId,
    status: 'delivered'
  })
    .populate('customerId', 'name email phone')
    .populate('deliveryPartnerId', 'name phone email')
    .populate('subscriptionId')
    .sort({ deliveryDate: -1 });

  res.status(200).json({
    success: true,
    count: deliveries.length,
    data: deliveries,
  });
});

/**
 * GET: Failed Deliveries for a Vendor
 * GET /api/v1/deliveries/vendor/failed
 */
export const getVendorFailedDeliveries = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const deliveries = await Delivery.find({
    vendorId,
    status: 'failed'
  })
    .populate('customerId', 'name email phone')
    .populate('deliveryPartnerId', 'name phone email')
    .populate('subscriptionId')
    .sort({ deliveryDate: -1 });

  res.status(200).json({
    success: true,
    count: deliveries.length,
    data: deliveries,
  });
});

/**
 * GET: Filtered Deliveries by Status for a Vendor (Generic helper fallback)
 * GET /api/v1/deliveries/vendor/status/:status
 */
export const getVendorDeliveriesByStatus = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const { status } = req.params;
  const allowedStatuses = ['pending', 'assigned', 'picked_up', 'out_for_delivery', 'delivered', 'failed', 'cancelled'];
  
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status filter. Allowed values: ${allowedStatuses.join(', ')}`);
  }

  const deliveries = await Delivery.find({
    vendorId,
    status
  })
    .populate('customerId', 'name email phone')
    .populate('deliveryPartnerId', 'name phone email')
    .populate('subscriptionId')
    .sort({ deliveryDate: 1, deliveryTime: 1 });

  res.status(200).json({
    success: true,
    count: deliveries.length,
    data: deliveries,
  });
});

/**
 * GET: Fetch Delivery Partners associated with Vendor business
 * GET /api/v1/deliveries/vendor/partners
 */
export const getVendorDeliveryPartners = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const partners = await User.find({ role: 'deliveryPartner', vendorId });

  const result = [];
  for (const partner of partners) {
    const activeDeliveriesCount = await Delivery.countDocuments({
      deliveryPartnerId: partner._id,
      status: { $in: ['assigned', 'picked_up', 'out_for_delivery'] }
    });

    result.push({
      deliveryPartnerId: partner._id,
      name: partner.name,
      email: partner.email,
      phone: partner.phone || '',
      status: partner.isActive ? 'active' : 'inactive',
      activeDeliveriesCount
    });
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});

/**
 * PATCH: Vendor assigns a Delivery Partner to a Delivery (Single)
 * PATCH /api/v1/deliveries/:deliveryId/assign
 */
export const assignDeliveryPartner = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  const { deliveryId } = req.params;
  const { deliveryPartnerId } = req.body;

  if (!vendorId) {
    throw new ApiError(401, 'User not authenticated.');
  }
  if (!deliveryPartnerId) {
    throw new ApiError(400, 'deliveryPartnerId is required.');
  }

  // 1. Delivery must exist and belong to the Vendor
  const delivery = await Delivery.findOne({ _id: deliveryId, vendorId });
  if (!delivery) {
    throw new ApiError(404, 'Delivery not found or does not belong to this vendor.');
  }

  // 3. Delivery status must be "pending"
  if (delivery.status !== 'pending') {
    throw new ApiError(400, `Delivery status is '${delivery.status}'. Only 'pending' deliveries can be assigned.`);
  }

  // 4. Delivery Partner must exist
  const partner = await User.findById(deliveryPartnerId);
  if (!partner || partner.role !== 'deliveryPartner') {
    throw new ApiError(404, 'Delivery Partner not found.');
  }

  // 5. Delivery Partner must be active
  if (!partner.isActive) {
    throw new ApiError(400, 'Delivery Partner is inactive.');
  }

  // Update Delivery
  delivery.deliveryPartnerId = partner._id as any;
  delivery.status = 'assigned';
  delivery.assignedAt = new Date();

  await delivery.save();

  // Trigger notification event for Delivery Assigned
  try {
    await NotificationService.createNotification({
      userId: partner._id.toString(),
      userRole: 'deliveryPartner',
      title: '🚲 New Delivery Assigned',
      message: `You have been assigned a new delivery for subscription ${delivery.subscriptionId}.`,
      category: 'DELIVERY',
      type: 'info',
    });
  } catch (notifErr) {
    console.error('[Notification Error] Failed to send assignment notification:', notifErr);
  }

  res.status(200).json({
    success: true,
    message: 'Delivery partner assigned successfully.',
    data: delivery
  });
});

/**
 * PATCH: Bulk assign deliveries to a Delivery Partner
 * PATCH /api/v1/deliveries/assign-bulk
 */
export const assignDeliveryPartnerBulk = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const { deliveryIds, deliveryPartnerId } = req.body;

  if (!deliveryIds || !Array.isArray(deliveryIds) || deliveryIds.length === 0) {
    throw new ApiError(400, 'deliveryIds array is required and must not be empty.');
  }
  if (!deliveryPartnerId) {
    throw new ApiError(400, 'deliveryPartnerId is required.');
  }

  // Validate partner
  const partner = await User.findById(deliveryPartnerId);
  if (!partner || partner.role !== 'deliveryPartner') {
    throw new ApiError(404, 'Delivery Partner not found.');
  }
  if (!partner.isActive) {
    throw new ApiError(400, 'Delivery Partner is inactive.');
  }

  // Find all matching deliveries that belong to this vendor and are 'pending'
  const deliveries = await Delivery.find({
    _id: { $in: deliveryIds },
    vendorId,
    status: 'pending'
  });

  if (deliveries.length === 0) {
    throw new ApiError(400, 'No valid pending deliveries found for the provided IDs.');
  }

  const updatedIds = deliveries.map(d => d._id);

  // Perform bulk update
  await Delivery.updateMany(
    { _id: { $in: updatedIds } },
    {
      $set: {
        deliveryPartnerId: partner._id,
        status: 'assigned',
        assignedAt: new Date()
      }
    }
  );

  // Trigger notification event for Delivery Assigned bulk
  try {
    await NotificationService.createNotification({
      userId: partner._id.toString(),
      userRole: 'deliveryPartner',
      title: '🚲 Bulk Deliveries Assigned',
      message: `You have been assigned ${updatedIds.length} new deliveries.`,
      category: 'DELIVERY',
      type: 'info',
    });
  } catch (notifErr) {
    console.error('[Notification Error] Failed to send bulk assignment notification:', notifErr);
  }

  res.status(200).json({
    success: true,
    message: `Successfully assigned ${updatedIds.length} deliveries.`,
    data: {
      assignedCount: updatedIds.length,
      deliveryIds: updatedIds
    }
  });
});

/**
 * GET: Vendor Analytics
 * GET /api/v1/deliveries/vendor/analytics
 */
export const getVendorAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const { start, end } = getTodayBounds();

  // Count metrics
  const todayCount = await Delivery.countDocuments({
    vendorId,
    deliveryDate: { $gte: start, $lte: end }
  });

  const pendingCount = await Delivery.countDocuments({ vendorId, status: 'pending' });
  const assignedCount = await Delivery.countDocuments({ vendorId, status: 'assigned' });
  const deliveredCount = await Delivery.countDocuments({ vendorId, status: 'delivered' });
  const failedCount = await Delivery.countDocuments({ vendorId, status: 'failed' });

  // Delivery Success Rate
  const totalCompleted = deliveredCount + failedCount;
  const successRate = totalCompleted > 0 ? parseFloat(((deliveredCount / totalCompleted) * 100).toFixed(2)) : 0;

  // Average Deliveries Per Partner
  const partnerCount = await User.countDocuments({ role: 'deliveryPartner', vendorId });
  const totalAssignedDeliveries = await Delivery.countDocuments({
    vendorId,
    deliveryPartnerId: { $ne: null }
  });
  const avgDeliveriesPerPartner = partnerCount > 0 ? parseFloat((totalAssignedDeliveries / partnerCount).toFixed(2)) : 0;

  res.status(200).json({
    success: true,
    data: {
      todayDeliveries: todayCount,
      pendingDeliveries: pendingCount,
      assignedDeliveries: assignedCount,
      deliveredDeliveries: deliveredCount,
      failedDeliveries: failedCount,
      deliverySuccessRate: successRate,
      averageDeliveriesPerPartner: avgDeliveriesPerPartner
    }
  });
});

// ==========================================
// DELIVERY PARTNER APIS
// ==========================================

/**
 * GET: Today's Deliveries for a Delivery Partner
 * GET /api/v1/deliveries/delivery-partner/today
 */
export const getDeliveryPartnerToday = asyncHandler(async (req: Request, res: Response) => {
  const partnerId = req.user?.id;
  if (!partnerId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const { start, end } = getTodayBounds();

  const deliveries = await Delivery.find({
    deliveryPartnerId: partnerId,
    deliveryDate: { $gte: start, $lte: end }
  })
    .populate('customerId', 'name email phone')
    .populate('vendorId', 'name businessName phone email kitchenAddress city')
    .populate('subscriptionId')
    .sort({ deliveryTime: 1 });

  res.status(200).json({
    success: true,
    count: deliveries.length,
    data: deliveries,
  });
});

/**
 * GET: Delivery History for a Delivery Partner
 * GET /api/v1/deliveries/delivery-partner/history
 */
export const getDeliveryPartnerHistory = asyncHandler(async (req: Request, res: Response) => {
  const partnerId = req.user?.id;
  if (!partnerId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const deliveries = await Delivery.find({
    deliveryPartnerId: partnerId,
    status: { $in: ['delivered', 'failed', 'cancelled'] }
  })
    .populate('customerId', 'name email phone')
    .populate('vendorId', 'name businessName phone email kitchenAddress city')
    .populate('subscriptionId')
    .sort({ deliveryDate: -1 });

  res.status(200).json({
    success: true,
    count: deliveries.length,
    data: deliveries,
  });
});

/**
 * PATCH: Delivery Partner updates status of an assigned delivery
 * PATCH /api/v1/deliveries/delivery-partner/:deliveryId/status
 */
export const updateDeliveryStatus = asyncHandler(async (req: Request, res: Response) => {
  const partnerId = req.user?.id;
  const { deliveryId } = req.params;
  const { status } = req.body;

  if (!partnerId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const allowedStatuses = ['picked_up', 'out_for_delivery', 'delivered', 'failed'];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
  }

  const delivery = await Delivery.findOne({ _id: deliveryId, deliveryPartnerId: partnerId });
  if (!delivery) {
    throw new ApiError(404, 'Delivery not found or not assigned to you.');
  }

  const currentStatus = delivery.status;
  const allowedTransitions: Record<string, string[]> = {
    'assigned': ['picked_up', 'failed'],
    'picked_up': ['out_for_delivery', 'failed'],
    'out_for_delivery': ['delivered', 'failed'],
    'pending': [],
    'delivered': [],
    'failed': [],
    'cancelled': []
  };

  const validNext = allowedTransitions[currentStatus] || [];
  if (!validNext.includes(status)) {
    throw new ApiError(400, `Invalid status transition from '${currentStatus}' to '${status}'.`);
  }

  // Update status and timestamps
  delivery.status = status as any;
  if (status === 'picked_up') {
    delivery.pickedUpAt = new Date();
  } else if (status === 'delivered') {
    delivery.deliveredAt = new Date();
  }

  await delivery.save();

  // Populate references for notification details
  const populated = await Delivery.findById(delivery._id)
    .populate('customerId', 'name')
    .populate('vendorId', 'businessName name');

  const customerName = (populated?.customerId as any)?.name || 'Customer';
  const vendorName = (populated?.vendorId as any)?.businessName || (populated?.vendorId as any)?.name || 'Vendor';

  // Trigger notifications
  try {
    if (status === 'picked_up') {
      await NotificationService.createNotification({
        userId: delivery.customerId.toString(),
        userRole: 'customer',
        title: '🍲 Meal Picked Up',
        message: `Your meal from ${vendorName} has been picked up by the delivery rider and is on its way.`,
        category: 'DELIVERY',
        type: 'info',
      });
    } else if (status === 'out_for_delivery') {
      await NotificationService.createNotification({
        userId: delivery.customerId.toString(),
        userRole: 'customer',
        title: '🚲 Out for Delivery',
        message: `Your tiffin from ${vendorName} is out for delivery! Prepare to receive your fresh meal.`,
        category: 'DELIVERY',
        type: 'info',
      });
    } else if (status === 'delivered') {
      await NotificationService.createNotification({
        userId: delivery.customerId.toString(),
        userRole: 'customer',
        title: '✅ Delivered Successfully',
        message: `Your meal from ${vendorName} has been delivered. Enjoy your hot home-cooked food!`,
        category: 'DELIVERY',
        type: 'success',
      });
      await NotificationService.createNotification({
        userId: delivery.vendorId.toString(),
        userRole: 'vendor',
        title: '🎉 Delivery Completed',
        message: `Delivery for subscription ${delivery.subscriptionId} to ${customerName} has been successfully completed.`,
        category: 'DELIVERY',
        type: 'success',
      });
    } else if (status === 'failed') {
      await NotificationService.createNotification({
        userId: delivery.customerId.toString(),
        userRole: 'customer',
        title: '⚠️ Delivery Failed',
        message: `We were unable to deliver your tiffin from ${vendorName}. Please contact support or the rider.`,
        category: 'DELIVERY',
        type: 'warning',
      });
      await NotificationService.createNotification({
        userId: delivery.vendorId.toString(),
        userRole: 'vendor',
        title: '🚨 Delivery Failed',
        message: `The delivery to ${customerName} for subscription ${delivery.subscriptionId} was marked as failed.`,
        category: 'DELIVERY',
        type: 'warning',
      });
    }
  } catch (err) {
    console.error('[Notification Hook Error] Failed to trigger notification event:', err);
  }

  res.status(200).json({
    success: true,
    message: `Delivery status updated to '${status}' successfully.`,
    data: delivery
  });
});

// ==========================================
// CUSTOMER APIS
// ==========================================

/**
 * GET: Customer Upcoming Deliveries
 * GET /api/v1/deliveries/customer/upcoming
 */
export const getCustomerUpcoming = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  if (!customerId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const { start } = getTodayBounds();

  const deliveries = await Delivery.find({
    customerId,
    deliveryDate: { $gte: start },
    status: { $in: ['pending', 'assigned', 'picked_up', 'out_for_delivery'] }
  })
    .populate('vendorId', 'name businessName phone email kitchenAddress city')
    .populate('deliveryPartnerId', 'name phone email')
    .populate('subscriptionId')
    .sort({ deliveryDate: 1, deliveryTime: 1 });

  res.status(200).json({
    success: true,
    count: deliveries.length,
    data: deliveries,
  });
});

/**
 * GET: Customer Delivery History
 * GET /api/v1/deliveries/customer/history
 */
export const getCustomerHistory = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  if (!customerId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const deliveries = await Delivery.find({
    customerId,
    status: { $in: ['delivered', 'failed', 'cancelled'] }
  })
    .populate('vendorId', 'name businessName phone email kitchenAddress city')
    .populate('deliveryPartnerId', 'name phone email')
    .populate('subscriptionId')
    .sort({ deliveryDate: -1 });

  res.status(200).json({
    success: true,
    count: deliveries.length,
    data: deliveries,
  });
});
