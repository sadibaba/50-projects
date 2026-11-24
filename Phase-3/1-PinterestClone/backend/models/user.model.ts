import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  cover: string;
  website: string;
  location: string;
  role: "user" | "admin";
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true, minlength: 3, maxlength: 30 },
    name: { type: String, default: "", trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false, minlength: 8 },
    bio: { type: String, default: "", maxlength: 300 },
    avatar: { type: String, default: "" },
    cover: { type: String, default: "" },
    website: { type: String, default: "" },
    location: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
