import mongoose, { Schema, model, models, type Model, type Types } from "mongoose";

export interface IPost {
  author: Types.ObjectId;
  imageUrl: string;
  videoUrl: string;
  type: "image" | "video";
  caption: string;
  altText: string;
  location: string;
  tags: string[];
  likes: Types.ObjectId[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    imageUrl: { type: String, required: true },
    videoUrl: { type: String, default: "" },
    type: { type: String, enum: ["image", "video"], default: "image" },
    caption: { type: String, default: "", maxlength: 2200 },
    altText: { type: String, default: "", maxlength: 300 },
    location: { type: String, default: "", maxlength: 100 },
    tags: [{ type: String, trim: true, lowercase: true }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ caption: "text" });

const Post: Model<IPost> = models.Post || model<IPost>("Post", postSchema);
export default Post;
