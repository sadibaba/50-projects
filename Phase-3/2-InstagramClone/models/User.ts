import mongoose, { Schema, model, models, type Model, type Types } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  name: string;
  bio: string;
  avatar: string;
  website: string;
  isPrivate: boolean;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  savedPosts: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    name: { type: String, default: "", trim: true, maxlength: 60 },
    bio: { type: String, default: "", maxlength: 200 },
    avatar: { type: String, default: "" },
    website: { type: String, default: "", maxlength: 200 },
    isPrivate: { type: Boolean, default: false },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    savedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);
export default User;
