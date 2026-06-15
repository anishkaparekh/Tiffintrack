import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  customerId: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentGateway: string;
  transactionId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required'],
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: false,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    currency: {
      type: String,
      default: 'INR',
      required: true,
    },
    paymentStatus: {
      type: String,
      required: [true, 'Payment status is required'],
    },
    paymentGateway: {
      type: String,
      default: 'Razorpay',
      required: true,
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
    },
    razorpayOrderId: {
      type: String,
      required: [true, 'Razorpay Order ID is required'],
    },
    razorpayPaymentId: {
      type: String,
      required: [true, 'Razorpay Payment ID is required'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
