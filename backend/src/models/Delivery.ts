import mongoose, { Schema, Document } from 'mongoose';

export interface IDelivery extends Document {
  customerId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  subscriptionId: mongoose.Types.ObjectId;
  mealId?: mongoose.Types.ObjectId;
  deliveryPartnerId?: mongoose.Types.ObjectId;
  deliveryDate: Date;
  deliveryTime: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'failed' | 'cancelled';
  assignedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySchema = new Schema<IDelivery>(
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
      required: [true, 'Subscription ID is required'],
    },
    mealId: {
      type: Schema.Types.ObjectId,
      ref: 'Meal',
    },
    deliveryPartnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Delivery date is required'],
    },
    deliveryTime: {
      type: String,
      required: [true, 'Delivery time is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked_up', 'out_for_delivery', 'delivered', 'failed', 'cancelled'],
      default: 'pending',
      required: [true, 'Status is required'],
    },
    assignedAt: {
      type: Date,
    },
    pickedUpAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
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

// Compound unique index to prevent duplicate deliveries on the same date/time for a subscription
DeliverySchema.index({ subscriptionId: 1, deliveryDate: 1, deliveryTime: 1 }, { unique: true });

export const Delivery = mongoose.model<IDelivery>('Delivery', DeliverySchema);
