import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/Review';
import { Order } from '../models/Order';
import { Subscription } from '../models/Subscription';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Submit a new Review (Customer only).
 * POST /api/v1/reviews
 */
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  if (req.user.role !== 'customer') {
    throw new ApiError(403, 'Access denied. Only customers can write reviews.');
  }

  const { vendorId, subscriptionId, orderId, rating, reviewText } = req.body;
  const customerId = req.user.id;

  // 1. Verify that either subscriptionId or orderId is provided
  if (!subscriptionId && !orderId) {
    throw new ApiError(400, 'Either subscriptionId or orderId must be specified.');
  }

  // 2. Eligibility checks
  if (subscriptionId) {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new ApiError(404, 'Subscription not found.');
    }
    if (subscription.customerId.toString() !== customerId) {
      throw new ApiError(403, 'You can only review your own subscriptions.');
    }
    if (subscription.vendorId.toString() !== vendorId) {
      throw new ApiError(400, 'Subscription does not belong to this vendor.');
    }

    // Uniqueness: Check if already reviewed
    const existing = await Review.findOne({ customerId, subscriptionId });
    if (existing) {
      throw new ApiError(400, 'You have already submitted a review for this subscription.');
    }
  }

  if (orderId) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found.');
    }
    if (order.customerId.toString() !== customerId) {
      throw new ApiError(403, 'You can only review your own orders.');
    }
    if (order.vendorId.toString() !== vendorId) {
      throw new ApiError(400, 'Order does not belong to this vendor.');
    }

    // Uniqueness: Check if already reviewed
    const existing = await Review.findOne({ customerId, orderId });
    if (existing) {
      throw new ApiError(400, 'You have already submitted a review for this order.');
    }
  }

  // 3. Create Review
  const review = await Review.create({
    customerId,
    vendorId,
    subscriptionId,
    orderId,
    rating,
    reviewText,
    isEdited: false,
  });

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: review,
  });
});

/**
 * Get all reviews for a vendor (Public).
 * GET /api/v1/reviews/vendor/:vendorId
 */
export const getVendorReviews = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params;

  const reviews = await Review.find({ vendorId })
    .populate('customerId', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

/**
 * Get all reviews by a customer (Customer or Admin).
 * GET /api/v1/reviews/customer/:customerId
 */
export const getCustomerReviews = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  const reviews = await Review.find({ customerId })
    .populate('vendorId', 'name email businessName kitchenAddress city')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

/**
 * Update a Review (Owner customer only).
 * PUT /api/v1/reviews/:id
 */
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(404, 'Review not found.');
  }

  // Ownership verification
  if (review.customerId.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied. You cannot modify other customers\' reviews.');
  }

  const { rating, reviewText } = req.body;

  const updatedReview = await Review.findByIdAndUpdate(
    id,
    {
      ...(rating !== undefined && { rating }),
      ...(reviewText !== undefined && { reviewText }),
      isEdited: true,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: updatedReview,
  });
});

/**
 * Delete a Review (Owner customer or Admin only).
 * DELETE /api/v1/reviews/:id
 */
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(404, 'Review not found.');
  }

  // Verify ownership or admin role
  if (review.customerId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. You are not authorized to delete this review.');
  }

  await Review.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

/**
 * Get rating statistics summary for a vendor (Public).
 * GET /api/v1/reviews/vendor/:vendorId/stats
 */
export const getVendorReviewStats = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    throw new ApiError(400, 'Invalid Vendor ID format.');
  }

  const stats = await Review.aggregate([
    { $match: { vendorId: new mongoose.Types.ObjectId(vendorId) } },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating' },
              totalReviews: { $sum: 1 },
            },
          },
        ],
        breakdown: [
          {
            $group: {
              _id: '$rating',
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const summary = stats[0].summary[0] || { averageRating: 0, totalReviews: 0 };
  const breakdownRaw = stats[0].breakdown || [];

  const ratingBreakdown: Record<string, number> = {
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0,
  };

  breakdownRaw.forEach((item: any) => {
    const ratingStr = item._id.toString();
    if (ratingStr in ratingBreakdown) {
      ratingBreakdown[ratingStr] = item.count;
    }
  });

  res.status(200).json({
    success: true,
    data: {
      averageRating: Math.round((summary.averageRating || 0) * 10) / 10,
      totalReviews: summary.totalReviews || 0,
      ratingBreakdown,
    },
  });
});
