import mongoose, { Schema, model, models, type Model, type Types } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  name: string;
  role: "customer" | "admin";
  phone: string;
  address: { line1: string; city: string; postalCode: string; country: string };
  wishlist: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    name: { type: String, default: "", trim: true, maxlength: 60 },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    phone: { type: String, default: "", maxlength: 30 },
    address: {
      line1: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);
export default User;
