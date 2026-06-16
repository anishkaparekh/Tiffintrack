import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES, UserRole } from '../constants/roles';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  verificationStatus?: 'pending' | 'under_review' | 'approved' | 'rejected';
  phone?: string;
  businessName?: string;
  kitchenAddress?: string;
  city?: string;
  mealsPerDay?: number;
  description?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  vendorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      required: function(this: any) {
        return this.role === ROLES.VENDOR;
      },
      default: function(this: any) {
        if (this.role === ROLES.VENDOR) {
          return 'pending';
        }
        return undefined;
      }
    },
    phone: {
      type: String,
      trim: true,
    },
    vehicleType: {
      type: String,
      trim: true,
      required: function(this: any) {
        return this.role === ROLES.DELIVERY_PARTNER;
      },
    },
    vehicleNumber: {
      type: String,
      trim: true,
      required: function(this: any) {
        return this.role === ROLES.DELIVERY_PARTNER;
      },
    },
    businessName: {
      type: String,
      trim: true,
      required: function(this: any) {
        return this.role === ROLES.VENDOR;
      },
    },
    kitchenAddress: {
      type: String,
      trim: true,
      required: function(this: any) {
        return this.role === ROLES.VENDOR;
      },
    },
    city: {
      type: String,
      trim: true,
      required: function(this: any) {
        return this.role === ROLES.VENDOR;
      },
    },
    mealsPerDay: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password || '', salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  // If password was loaded, compare. (If password select is false, we must retrieve it manually when query runs)
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
