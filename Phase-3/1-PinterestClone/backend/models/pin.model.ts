import mongoose, { Schema, Document } from "mongoose";

export interface IPin extends Document {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  posterUrl: string;
  type: "image" | "video";
  sourceName: string;
  sourceUrl: string;
  category: string;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  board?: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  saves: mongoose.Types.ObjectId[];
  commentsCount: number;
  views: number;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}

const pinSchema = new Schema<IPin>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", maxlength: 1000 },
    imageUrl: { type: String, required: true },
    videoUrl: { type: String, default: "" },
    posterUrl: { type: String, default: "" },
    type: { type: String, enum: ["image", "video"], default: "image" },
    sourceName: { type: String, default: "Picsum" },
    sourceUrl: { type: String, default: "" },
    category: { type: String, default: "Inspiration", index: true },
    tags: [{ type: String, trim: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    board: { type: Schema.Types.ObjectId, ref: "Board" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    saves: [{ type: Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    width: { type: Number, default: 600 },
    height: { type: Number, default: 900 },
  },
  { timestamps: true }
);

pinSchema.index({ createdAt: -1 });
pinSchema.index({ title: "text", description: "text", tags: "text" });
export default mongoose.model<IPin>("Pin", pinSchema);
