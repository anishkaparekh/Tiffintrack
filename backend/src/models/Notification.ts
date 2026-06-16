import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId?: mongoose.Types.ObjectId;
  userRole: 'customer' | 'vendor' | 'admin' | 'deliveryPartner';
  title: string;
  message: string;
  category: 'ORDER' | 'SUBSCRIPTION' | 'PAYMENT' | 'MEAL' | 'DELIVERY' | 'CUSTOMER' | 'VENDOR' | 'ADMIN' | 'SYSTEM' | 'PROMOTIONAL';
  type: 'success' | 'info' | 'warning' | 'error';
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    userRole: {
      type: String,
      required: true,
      enum: ['customer', 'vendor', 'admin', 'deliveryPartner'],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'ORDER',
        'SUBSCRIPTION',
        'PAYMENT',
        'MEAL',
        'DELIVERY',
        'CUSTOMER',
        'VENDOR',
        'ADMIN',
        'SYSTEM',
        'PROMOTIONAL',
      ],
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['success', 'info', 'warning', 'error'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    actionUrl: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast retrieval of unread notifications by user
NotificationSchema.index({ userId: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
