import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  text: string;
  user: mongoose.Types.ObjectId;
  pin: mongoose.Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pin: { type: Schema.Types.ObjectId, ref: "Pin", required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", commentSchema);
