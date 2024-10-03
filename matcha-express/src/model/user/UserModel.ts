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
  lastName: string;
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
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  avatar: { type: String, required: false },
  album: { type: [String], required: false },
  isDeleted: { type: Boolean, default: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
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

export function findUserByField(model: mongoose.Model<IUser>, fieldName: string, value: string): Promise<IUser | null> {
  return model.findOne({ [fieldName]: value });
}

userSchema.index({ userLocation: '2dsphere' });

// Create a model using the schema and interface
const UserModel = mongoose.model<IUser>('User', userSchema, 'User');

export { IUser, UserModel };