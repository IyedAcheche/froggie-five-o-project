import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Define user roles
export enum UserRole {
  RIDER = 'rider',
  DRIVER = 'driver',
  DISPATCHER = 'dispatcher'
}

// Define user document interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phoneNumber: string;
  profilePicture?: string;
  isOnDuty?: boolean;
  assignedCart?: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define user schema
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.RIDER
    },
    phoneNumber: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String
    },
    isOnDuty: {
      type: Boolean,
      default: false
    },
    assignedCart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 