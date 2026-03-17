import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user.js';

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    picture: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
