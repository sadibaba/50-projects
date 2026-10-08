import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "reader"],
      default: "reader",
    },
    bio: {
      type: String,
      maxlength: 200,
      default: "Curious reader exploring stories of remarkable people.",
    },
    avatar: { type: String, default: "" },
    hasSeenTutorial: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);