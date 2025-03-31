import mongoose, { Document, Schema } from 'mongoose';

// Define cart status
export enum CartStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance'
}

// Define cart document interface
export interface ICart extends Document {
  cartNumber: string;
  description?: string;
  status: CartStatus;
  currentDriver?: mongoose.Types.ObjectId;
  lastMaintenance?: Date;
}

// Define cart schema
const cartSchema = new Schema<ICart>(
  {
    cartNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(CartStatus),
      default: CartStatus.AVAILABLE
    },
    currentDriver: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    lastMaintenance: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICart>('Cart', cartSchema); 