import mongoose, { Schema, Document } from "mongoose";

export interface IPin extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  createdBy: mongoose.Types.ObjectId;
  board?: mongoose.Types.ObjectId;
  createdAt: Date;
    likes: mongoose.Types.ObjectId[];   
  saves: mongoose.Types.ObjectId[]
}

const pinSchema = new Schema<IPin>(
  {
    title:       { type: String, required: true },
    description: { type: String },
    imageUrl:    { type: String, required: true },
    createdBy:   { type: Schema.Types.ObjectId, ref: "User", required: true },
    board:       { type: Schema.Types.ObjectId, ref: "Board" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    saves: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model<IPin>("Pin", pinSchema);
