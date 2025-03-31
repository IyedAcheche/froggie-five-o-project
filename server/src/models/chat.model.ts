import mongoose, { Document, Schema } from 'mongoose';

// Define chat types
export enum ChatType {
  PRIVATE = 'private',
  RIDE = 'ride',
  DRIVER_GROUP = 'driver_group'
}

// Define message interface
export interface IMessage {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  read: boolean;
}

// Define message schema
const messageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

// Define chat document interface
export interface IChat extends Document {
  type: ChatType;
  participants: mongoose.Types.ObjectId[];
  ride?: mongoose.Types.ObjectId;
  messages: IMessage[];
  lastActivity: Date;
}

// Define chat schema
const chatSchema = new Schema<IChat>(
  {
    type: {
      type: String,
      enum: Object.values(ChatType),
      required: true
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    ride: {
      type: Schema.Types.ObjectId,
      ref: 'Ride'
    },
    messages: [messageSchema],
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
chatSchema.index({ participants: 1 });
chatSchema.index({ ride: 1 });
chatSchema.index({ lastActivity: -1 });

export default mongoose.model<IChat>('Chat', chatSchema); 