import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { notify } from "@/lib/notify";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const me = await requireUser(request);
    const { username } = await params;
    await connectDB();
    const target = await User.findOne({ username: username.toLowerCase() });
    if (!target) return fail("User not found", 404);
    if (String(target._id) === String(me._id)) return fail("You cannot follow yourself");

    const following = target.followers.some((id) => String(id) === String(me._id));
    if (following) {
      target.followers = target.followers.filter((id) => String(id) !== String(me._id));
      me.following = me.following.filter((id) => String(id) !== String(target._id));
    } else {
      target.followers.push(new mongoose.Types.ObjectId(String(me._id)));
      me.following.push(target._id);
    }
    await Promise.all([target.save(), me.save()]);
    if (!following) await notify({ recipient: target._id, actor: me._id, type: "follow" });

    return ok({ following: !following, followersCount: target.followers.length });
  } catch (error) {
    return handleError(error);
  }
}
