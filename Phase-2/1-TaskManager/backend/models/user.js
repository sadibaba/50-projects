import { Schema, model } from "mongoose";

const settingsSchema = new Schema(
  {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    language: { type: String, enum: ["en", "ur"], default: "en" },
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    privacy: { type: String, enum: ["public", "private"], default: "private" },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, default: "", trim: true, maxlength: 30 },
    location: { type: String, default: "", trim: true, maxlength: 120 },
    website: { type: String, default: "", trim: true, maxlength: 200 },
    bio: { type: String, default: "", trim: true, maxlength: 500 },
    settings: { type: settingsSchema, default: () => ({}) },
    lastLoginAt: { type: Date, default: null },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    return ret;
  },
});

export default model("User", userSchema);
