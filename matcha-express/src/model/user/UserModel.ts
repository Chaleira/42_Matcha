import mongoose, { Schema } from "mongoose";

// Define an interface for your document
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  age: number;
  // first_name: string;
  // last_name: string;
  // bio: string;
  // tags: string[];
  // gender: string;
  // sexual_orientation: string;
  isDeleted: boolean;
  userLocation: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

// Define a schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  age: { type: Number, required: true },
  userLocation: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

export function hasField(model: mongoose.Model<IUser>, fieldName: string): boolean {
  return !!model.schema.path(fieldName);
}

userSchema.index({ userLocation: '2dsphere' });

// Create a model using the schema and interface
const UserModel = mongoose.model<IUser>('User', userSchema, 'User');

export {IUser, UserModel};