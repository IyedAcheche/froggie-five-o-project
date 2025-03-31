import mongoose, { Document, Schema } from 'mongoose';

// Define ride status
export enum RideStatus {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Define ride document interface
export interface IRide extends Document {
  rider: mongoose.Types.ObjectId;
  driver?: mongoose.Types.ObjectId;
  cart?: mongoose.Types.ObjectId;
  pickupLocation: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  dropoffLocation: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  status: RideStatus;
  requestTime: Date;
  acceptTime?: Date;
  pickupTime?: Date;
  dropoffTime?: Date;
  notes?: string;
  distance?: number;
  duration?: number;
}

// Define ride schema
const rideSchema = new Schema<IRide>(
  {
    rider: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart'
    },
    pickupLocation: {
      address: {
        type: String,
        required: true
      },
      coordinates: {
        type: [Number, Number],
        required: true,
        index: '2dsphere'
      }
    },
    dropoffLocation: {
      address: {
        type: String,
        required: true
      },
      coordinates: {
        type: [Number, Number],
        required: true,
        index: '2dsphere'
      }
    },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.REQUESTED
    },
    requestTime: {
      type: Date,
      default: Date.now
    },
    acceptTime: {
      type: Date
    },
    pickupTime: {
      type: Date
    },
    dropoffTime: {
      type: Date
    },
    notes: {
      type: String
    },
    distance: {
      type: Number
    },
    duration: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IRide>('Ride', rideSchema); 