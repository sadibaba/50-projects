import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { fail, handleError, ok } from "@/lib/api";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { notify } from "@/lib/notify";
import { cleanText, isObjectId } from "@/lib/validators";
import { getVisiblePost } from "@/lib/privacy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isObjectId(id)) return fail("Invalid post id");
    await connectDB();
    const viewer = await getCurrentUser(request);
    await getVisiblePost(id, viewer ? String(viewer._id) : undefined);
    const comments = await Comment.find({ post: id })
      .populate("user", "username name avatar")
      .sort({ createdAt: -1 })
      .lean();
    return ok(comments);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    const { id } = await params;
    if (!isObjectId(id)) return fail("Invalid post id");
    await connectDB();

    const post = await getVisiblePost(id, String(user._id));

    const body = await request.json().catch(() => ({}));
    const text = cleanText(body.text, 1000);
    if (!text) return fail("Comment cannot be empty");

    const comment = await Comment.create({ post: post._id, user: user._id, text });
    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();
    await notify({ recipient: (post.author as any)._id || post.author, actor: user._id, type: "comment", post: post._id });

    const populated = await Comment.findById(comment._id).populate("user", "username name avatar").lean();
    return ok(populated, 201);
  } catch (error) {
    return handleError(error);
  }
}
