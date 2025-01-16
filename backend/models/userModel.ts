import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema
const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
