import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "author", "reader"],
      default: "reader",
    },
    bio: {
      type: String,
      maxlength: 200,
      default: "Passionate writer and reader. Exploring the world one story at a time.",
    },
    avatar: {
      type: String,
      default: "",
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);