import { Request, Response } from 'express';
import crypto from 'crypto';
import razorpay from '../config/razorpay';
import { Payment } from '../models/Payment';
import { Subscription } from '../models/Subscription';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Create a new Razorpay Order.
 * POST /api/v1/payments/create-order
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { amount, planId, customerId } = req.body;

  if (!amount) {
    throw new ApiError(400, 'Amount is required to create a payment order.');
  }

  // Razorpay expects amount in paisa (sub-unit of currency)
  const amountInPaisa = Math.round(amount * 100);

  const options = {
    amount: amountInPaisa,
    currency: 'INR',
    receipt: `rcpt_${planId ? String(planId).slice(-4) : 'x'}_${customerId ? String(customerId).slice(-4) : 'y'}_${Date.now()}`
  };

  const order = await razorpay.orders.create(options);

  res.status(201).json({
    success: true,
    data: order
  });
});

/**
 * Verify Razorpay Signature and save Payment document.
 * POST /api/v1/payments/verify
 */
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    customerId,
    amount
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !customerId ||
    amount === undefined
  ) {
    throw new ApiError(400, 'Missing required payment verification details.');
  }

  // 1. Verify cryptographic signature
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new ApiError(500, 'Razorpay key secret is not configured on server.');
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, 'Payment signature verification failed.');
  }

  // 2. Save payment document
  const payment = await Payment.create({
    customerId,
    amount,
    currency: 'INR',
    paymentStatus: 'Success',
    paymentGateway: 'Razorpay',
    transactionId: razorpay_payment_id,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id
  });

  res.status(200).json({
    success: true,
    message: 'Payment verified and captured successfully',
    data: payment
  });
});

/**
 * Get payment logs for a specific customer.
 * GET /api/v1/payments/customer/:customerId
 */
export const getCustomerPayments = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  const payments = await Payment.find({ customerId })
    .populate('subscriptionId')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});

/**
 * Get payment logs for a specific vendor's customers.
 * GET /api/v1/payments/vendor/:vendorId
 */
export const getVendorPayments = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params;

  // 1. Find all subscriptions for this vendor
  const subscriptions = await Subscription.find({ vendorId });
  const subIds = subscriptions.map(s => s._id);

  // 2. Find all payments linked to these subscriptions
  const payments = await Payment.find({ subscriptionId: { $in: subIds } })
    .populate('customerId', 'name email phone')
    .populate({
      path: 'subscriptionId',
      select: 'planName status'
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});
