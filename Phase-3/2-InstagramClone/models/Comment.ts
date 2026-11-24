import mongoose, { Schema, model, models, type Model, type Types } from "mongoose";

export interface IComment {
  post: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const Comment: Model<IComment> = models.Comment || model<IComment>("Comment", commentSchema);
export default Comment;
