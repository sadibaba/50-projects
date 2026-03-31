import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  pins: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const boardSchema = new Schema<IBoard>(
  {
    name:        { type: String, required: true },
    description: { type: String },
    createdBy:   { type: Schema.Types.ObjectId, ref: "User", required: true },
    pins:        [{ type: Schema.Types.ObjectId, ref: "Pin" }],
  },
  { timestamps: true }
);

export default mongoose.model<IBoard>("Board", boardSchema);
