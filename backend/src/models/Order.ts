import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  mealId: mongoose.Types.ObjectId;
  orderDate: Date;
  deliveryDate: Date;
  mealType: 'Veg' | 'Non-Veg' | 'Jain' | 'Both';
  status: 'Pending' | 'Preparing' | 'Out For Delivery' | 'Delivered' | 'Cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
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
    mealId: {
      type: Schema.Types.ObjectId,
      ref: 'Meal',
      required: [true, 'Meal ID is required'],
    },
    orderDate: {
      type: Date,
      required: [true, 'Order date is required'],
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Delivery date is required'],
    },
    mealType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Jain', 'Both'],
      required: [true, 'Meal type is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Out For Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
