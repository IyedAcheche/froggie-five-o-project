import mongoose from 'mongoose';

/**
 * Safely converts a value to a Mongoose ObjectId
 * @param id The value to convert to an ObjectId
 * @returns A Mongoose ObjectId or undefined if the conversion fails
 */
export const toObjectId = (id: any): mongoose.Types.ObjectId | undefined => {
  try {
    if (id instanceof mongoose.Types.ObjectId) {
      return id;
    }
    if (mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}; 