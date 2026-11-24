import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; commentId: string }> }) {
  try {
    const user = await requireUser(request);
    const { id, commentId } = await params;
    await connectDB();
    const comment = await Comment.findById(commentId);
    if (!comment || String(comment.post) !== id) return fail("Comment not found", 404);

    const post = await Post.findById(id);
    const allowed = String(comment.user) === String(user._id) || (post && String(post.author) === String(user._id));
    if (!allowed) return fail("You cannot delete this comment", 403);

    await comment.deleteOne();
    if (post) {
      post.commentsCount = Math.max(0, (post.commentsCount || 1) - 1);
      await post.save();
    }
    return ok({ message: "Comment deleted" });
  } catch (error) {
    return handleError(error);
  }
}
