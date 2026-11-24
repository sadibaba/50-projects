import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const user = await requireUser(request);
    await connectDB();
    await Notification.updateMany({ recipient: user._id, read: false }, { read: true });
    return ok({ message: "All notifications marked as read" });
  } catch (error) {
    return handleError(error);
  }
}
