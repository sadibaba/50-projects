import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Story from "@/models/Story";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    const { id } = await params;
    await connectDB();
    const story = await Story.findById(id);
    if (!story) return fail("Story not found", 404);
    if (String(story.user) !== String(user._id)) return fail("You can only delete your own story", 403);
    await story.deleteOne();
    return ok({ message: "Story deleted" });
  } catch (error) {
    return handleError(error);
  }
}
