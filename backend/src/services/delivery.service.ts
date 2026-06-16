import { Subscription } from '../models/Subscription';
import { Delivery, IDelivery } from '../models/Delivery';
import { ApiError } from '../utils/ApiError';

/**
 * Automatically generates daily delivery records for an active subscription.
 * Handles both single-meal (lunch/dinner) and double-meal (lunch + dinner) plans.
 * 
 * @param subscriptionId The ID of the subscription to generate deliveries for
 */
export const generateDeliveriesFromSubscription = async (subscriptionId: string | any): Promise<IDelivery[]> => {
  // 1. Fetch Subscription populated with the Plan details
  const subscription = await Subscription.findById(subscriptionId).populate('planId');
  if (!subscription) {
    throw new ApiError(404, 'Subscription not found.');
  }

  // 2. Validate subscription properties
  if (subscription.status.toLowerCase() !== 'active') {
    throw new ApiError(400, 'Deliveries can only be generated for active subscriptions.');
  }
  if (!subscription.customerId) {
    throw new ApiError(400, 'Subscription is missing customerId.');
  }
  if (!subscription.vendorId) {
    throw new ApiError(400, 'Subscription is missing vendorId.');
  }
  if (!subscription.startDate) {
    throw new ApiError(400, 'Subscription is missing startDate.');
  }

  let endDate = subscription.endDate;
  if (!endDate) {
    const plan = subscription.planId as any;
    if (plan && plan.duration) {
      const durationDays = plan.duration === 'weekly' ? 7 : 30;
      endDate = new Date(subscription.startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
    } else {
      throw new ApiError(400, 'Subscription is missing endDate and Plan details.');
    }
  }

  // 3. Prevent duplicate deliveries by checking if any exist
  const existingCount = await Delivery.countDocuments({ subscriptionId: subscription._id });
  if (existingCount > 0) {
    console.log(`[Delivery Service] Deliveries already exist for subscription ${subscription._id}. Skipping generation.`);
    // Return existing deliveries to maintain idempotency
    return await Delivery.find({ subscriptionId: subscription._id });
  }

  // 4. Calculate duration in days
  const diffTime = Math.abs(endDate.getTime() - subscription.startDate.getTime());
  const durationDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (durationDays <= 0) {
    throw new ApiError(400, 'Subscription duration must be at least 1 day.');
  }

  // Get plan details (fallback if planId was deleted or not populated)
  const plan = subscription.planId as any;
  const mealsPerDay = plan ? (plan.mealsPerDay || 1) : 1;
  const planName = plan ? (plan.planName || '') : '';
  const description = plan ? (plan.description || '') : '';

  const deliveriesToInsert = [];

  // 5. Generate deliveries for each day
  for (let i = 0; i < durationDays; i++) {
    const deliveryDate = new Date(subscription.startDate);
    deliveryDate.setDate(deliveryDate.getDate() + i);
    // Keep date portion only
    deliveryDate.setHours(0, 0, 0, 0);

    if (mealsPerDay === 2) {
      // Lunch slot
      deliveriesToInsert.push({
        customerId: subscription.customerId,
        vendorId: subscription.vendorId,
        subscriptionId: subscription._id,
        deliveryDate,
        deliveryTime: '12:30 PM',
        status: 'pending' as const,
      });
      // Dinner slot
      deliveriesToInsert.push({
        customerId: subscription.customerId,
        vendorId: subscription.vendorId,
        subscriptionId: subscription._id,
        deliveryDate,
        deliveryTime: '7:00 PM',
        status: 'pending' as const,
      });
    } else {
      // Determine if dinner based on keywords or field, default to lunch
      const isDinner = /dinner|evening|night/i.test(planName) || /dinner|evening|night/i.test(description) || (subscription.deliveryTime && /dinner|evening|night/i.test(subscription.deliveryTime));
      deliveriesToInsert.push({
        customerId: subscription.customerId,
        vendorId: subscription.vendorId,
        subscriptionId: subscription._id,
        deliveryDate,
        deliveryTime: isDinner ? '7:00 PM' : (subscription.deliveryTime || '12:30 PM'),
        status: 'pending' as const,
      });
    }
  }

  // 6. Use Bulk Insert for performance
  let createdDeliveries: IDelivery[] = [];
  try {
    createdDeliveries = await Delivery.insertMany(deliveriesToInsert, { ordered: false }) as any;
    console.log(`[Delivery Service] Successfully generated ${createdDeliveries.length} deliveries for subscription ${subscription._id}.`);
  } catch (error: any) {
    // If some succeeded but some failed due to duplicate keys, we can handle it
    if (error.code === 11000) {
      console.warn('[Delivery Service] Duplicate key error caught during bulk insert. Some records may already exist.');
      createdDeliveries = await Delivery.find({ subscriptionId: subscription._id });
    } else {
      throw error;
    }
  }

  return createdDeliveries;
};

/**
 * Scans all active subscriptions and generates deliveries if they don't have any.
 */
export const syncMissingDeliveries = async (): Promise<void> => {
  try {
    console.log('[Delivery Service] Starting sync of missing deliveries for active subscriptions...');
    const activeSubscriptions = await Subscription.find({ status: { $regex: /^active$/i } });
    console.log(`[Delivery Service] Found ${activeSubscriptions.length} active subscriptions.`);
    
    let generatedCount = 0;
    for (const sub of activeSubscriptions) {
      const existingCount = await Delivery.countDocuments({ subscriptionId: sub._id });
      if (existingCount === 0) {
        console.log(`[Delivery Service] Generating missing deliveries for subscription ${sub._id}`);
        await generateDeliveriesFromSubscription(sub._id);
        generatedCount++;
      }
    }
    console.log(`[Delivery Service] Sync complete. Generated deliveries for ${generatedCount} subscriptions.`);
  } catch (error) {
    console.error('[Delivery Service] Error syncing missing deliveries:', error);
  }
};

