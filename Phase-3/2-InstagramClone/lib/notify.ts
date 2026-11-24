import type { Types } from "mongoose";
import Notification from "@/models/Notification";

export async function notify({ recipient, actor, type, post }: { recipient: Types.ObjectId | string; actor: Types.ObjectId | string; type: "like" | "comment" | "follow" | "save"; post?: Types.ObjectId | string }) {
  if (!recipient || String(recipient) === String(actor)) return;
  await Notification.create({ recipient, actor, type, post });
}
