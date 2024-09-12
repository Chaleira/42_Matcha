import mongoose, { Schema } from "mongoose";

// Define an interface for your document
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar: { type: String, required: false };
  album: { type: [String], required: false };
  age: number;
  firstName: string;
  lastNname: string;
  bio: string;
  tags: string[];
  gender: string;
  sexualOrientation: string;
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
  avatar: { type: String, required: false },
  album: { type: [String], required: false },
  password: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  age: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastNname: { type: String, required: true },
  bio: { type: String, required: true },
  tags: {
    type: [String], required:
      true
  },
  gender: { type: String, required: true },
  sexualOrientation: { type: String, required: true },
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

export { IUser, UserModel };