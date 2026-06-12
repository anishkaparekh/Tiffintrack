import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  customerId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  vendorName: string;
  planName: string;
  status: 'Active' | 'Paused' | 'Expired' | 'Cancelled';
  startDate: Date;
  endDate: Date;
  mealsRemaining: number;
  deliveryAddress: string;
  preferences: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required'],
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vendor ID is required'],
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: [true, 'Plan ID is required'],
    },
    vendorName: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
    },
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Expired', 'Cancelled'],
      default: 'Active',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    mealsRemaining: {
      type: Number,
      required: [true, 'Meals remaining is required'],
      min: [0, 'Meals remaining cannot be negative'],
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
    },
    preferences: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
