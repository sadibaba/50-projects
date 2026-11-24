import mongoose, { Schema, model, models, type Model, type Types } from "mongoose";

export interface IStory {
  user: Types.ObjectId;
  imageUrl: string;
  caption: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "", maxlength: 200 },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

const Story: Model<IStory> = models.Story || model<IStory>("Story", storySchema);
export default Story;
