import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
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

    const liked = post.likes.some((userId) => String(userId) === String(user._id));
    if (liked) {
      post.likes = post.likes.filter((userId) => String(userId) !== String(user._id));
    } else {
      post.likes.push(new mongoose.Types.ObjectId(String(user._id)));
    }
    await post.save();

    if (!liked) await notify({ recipient: (post.author as any)._id || post.author, actor: user._id, type: "like", post: post._id });
    return ok({ liked: !liked, likesCount: post.likes.length });
  } catch (error) {
    return handleError(error);
  }
}
