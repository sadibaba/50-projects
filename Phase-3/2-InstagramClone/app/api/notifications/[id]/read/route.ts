import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    const { id } = await params;
    await connectDB();
    await Notification.updateOne({ _id: id, recipient: user._id }, { read: true });
    return ok({ message: "Marked as read" });
  } catch (error) {
    return handleError(error);
  }
}
