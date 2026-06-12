import mongoose, { Schema, Document } from 'mongoose';

export interface IMeal extends Document {
  vendorId: mongoose.Types.ObjectId;
  mealName: string;
  description: string;
  price: number;
  mealType: 'Veg' | 'Non-Veg' | 'Jain' | 'Both';
  availability: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema = new Schema<IMeal>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vendor ID is required'],
    },
    mealName: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    mealType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Jain', 'Both'],
      required: [true, 'Meal type is required'],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Meal = mongoose.model<IMeal>('Meal', MealSchema);
