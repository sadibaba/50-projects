import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { notify } from "@/lib/notify";
import { isObjectId } from "@/lib/validators";
import { getVisiblePost } from "@/lib/privacy";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    const { id } = await params;
    if (!isObjectId(id)) return fail("Invalid post id");
    await connectDB();

    const post = await getVisiblePost(id, String(user._id));

    const saved = user.savedPosts.some((postId) => String(postId) === String(post._id));
    if (saved) {
      user.savedPosts = user.savedPosts.filter((postId) => String(postId) !== String(post._id));
    } else {
      user.savedPosts.push(post._id);
    }
    await user.save();

    if (!saved) await notify({ recipient: (post.author as any)._id || post.author, actor: user._id, type: "save", post: post._id });
    return ok({ saved: !saved });
  } catch (error) {
    return handleError(error);
  }
}
