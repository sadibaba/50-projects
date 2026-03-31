import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  text: string;
  userId: mongoose.Types.ObjectId;
  pinId: mongoose.Types.ObjectId;
}

const CommentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pinId: { type: Schema.Types.ObjectId, ref: "Pin", required: true }
}, { timestamps: true });

export default mongoose.model<IComment>("Comment", CommentSchema);
