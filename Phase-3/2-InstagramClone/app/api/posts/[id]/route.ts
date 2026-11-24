import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { handleError, ok } from "@/lib/api";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { buildSavedSet, postShape } from "@/lib/serialize";
import { cleanText, isObjectId } from "@/lib/validators";
import { getVisiblePost } from "@/lib/privacy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isObjectId(id)) return ok({ error: "Invalid post id" }, 400);
    await connectDB();
    const viewer = await getCurrentUser(request);
    const post = await getVisiblePost(id, viewer ? String(viewer._id) : undefined);
    return ok(postShape(post.toObject(), viewer ? String(viewer._id) : undefined, buildSavedSet(viewer)));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    const { id } = await params;
    await connectDB();
    const post = await Post.findById(id);
    if (!post) return ok({ error: "Post not found" }, 404);
    if (String(post.author) !== String(user._id)) return ok({ error: "You can only edit your own posts" }, 403);

    const body = await request.json().catch(() => ({}));
    if (body.caption !== undefined) post.caption = cleanText(body.caption, 2200);
    if (body.altText !== undefined) post.altText = cleanText(body.altText, 300);
    if (body.location !== undefined) post.location = cleanText(body.location, 100);
    await post.save();

    const populated = await Post.findById(post._id).populate("author", "username name avatar isPrivate").lean();
    return ok(postShape(populated, String(user._id), buildSavedSet(user)));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    const { id } = await params;
    await connectDB();
    const post = await Post.findById(id);
    if (!post) return ok({ error: "Post not found" }, 404);
    if (String(post.author) !== String(user._id)) return ok({ error: "You can only delete your own posts" }, 403);

    await Promise.all([
      Comment.deleteMany({ post: post._id }),
      Notification.deleteMany({ post: post._id }),
      User.updateMany({ savedPosts: post._id }, { $pull: { savedPosts: post._id } }),
    ]);
    await post.deleteOne();
    return ok({ message: "Post deleted" });
  } catch (error) {
    return handleError(error);
  }
}
