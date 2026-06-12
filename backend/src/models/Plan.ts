import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  vendorId: mongoose.Types.ObjectId;
  planName: string;
  duration: 'weekly' | 'monthly';
  mealsPerDay: number;
  price: number;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vendor ID is required'],
    },
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    duration: {
      type: String,
      enum: ['weekly', 'monthly'],
      required: [true, 'Duration is required'],
    },
    mealsPerDay: {
      type: Number,
      required: [true, 'Meals per day is required'],
      min: [1, 'Meals per day must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Plan = mongoose.model<IPlan>('Plan', PlanSchema);
