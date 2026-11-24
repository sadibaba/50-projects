import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  actor: mongoose.Types.ObjectId;
  type: "like" | "comment" | "follow" | "save";
  pin?: mongoose.Types.ObjectId;
  board?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "comment", "follow", "save"], required: true },
    pin: { type: Schema.Types.ObjectId, ref: "Pin" },
    board: { type: Schema.Types.ObjectId, ref: "Board" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
export default mongoose.model<INotification>("Notification", notificationSchema);
