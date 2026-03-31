import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;   
  type: "follow" | "like" | "comment" | "save";
  fromUser: mongoose.Types.ObjectId; 
  pinId?: mongoose.Types.ObjectId;   
  isRead: boolean;
}

const NotificationSchema = new Schema<INotification>({
  userId:   { type: Schema.Types.ObjectId, ref: "User", required: true },
  type:     { type: String, enum: ["follow", "like", "comment", "save"], required: true },
  fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pinId:    { type: Schema.Types.ObjectId, ref: "Pin" },
  isRead:   { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<INotification>("Notification", NotificationSchema);
