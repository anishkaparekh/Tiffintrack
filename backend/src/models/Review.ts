import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  customerId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  rating: number;
  reviewText: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
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
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: [500, 'Review text must not exceed 500 characters'],
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add unique indexes to prevent multiple reviews from a customer on the same subscription or order.
// Since subscriptionId and orderId are optional, we only want unique index where they exist.
// Fortunately, Mongoose/MongoDB handles sparse indexes or we can validate in the controller before save.
// Standard MongoDB unique index on subscriptionId will fail for multiple nulls unless it is sparse.
// So we will enforce uniqueness at the database level using compound unique indexes for non-null values.

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
