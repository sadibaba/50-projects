import mongoose, { Schema, model, models, type Model, type Types } from "mongoose";

export interface INotification {
  recipient: Types.ObjectId;
  actor: Types.ObjectId;
  type: "like" | "comment" | "follow" | "save";
  post?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "comment", "follow", "save"], required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification: Model<INotification> = models.Notification || model<INotification>("Notification", notificationSchema);
export default Notification;
