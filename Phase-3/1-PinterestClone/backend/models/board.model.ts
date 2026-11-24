import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  description: string;
  cover: string;
  isSecret: boolean;
  createdBy: mongoose.Types.ObjectId;
  pins: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new Schema<IBoard>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, default: "", maxlength: 300 },
    cover: { type: String, default: "" },
    isSecret: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    pins: [{ type: Schema.Types.ObjectId, ref: "Pin" }],
  },
  { timestamps: true }
);

export default mongoose.model<IBoard>("Board", boardSchema);
