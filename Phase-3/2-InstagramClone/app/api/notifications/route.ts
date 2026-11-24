import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    await connectDB();
    const notifications = await Notification.find({ recipient: user._id })
      .populate("actor", "username name avatar")
      .populate("post", "imageUrl caption")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const unread = await Notification.countDocuments({ recipient: user._id, read: false });
    return ok({ notifications, unread });
  } catch (error) {
    return handleError(error);
  }
}
