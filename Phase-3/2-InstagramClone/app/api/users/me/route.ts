import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { fail, handleError, ok } from "@/lib/api";
import { publicUser, requireUser } from "@/lib/auth";
import { cleanText, validateUsername } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    return ok(publicUser(user, true));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser(request);
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const updates: Record<string, unknown> = {};

    if (body.username !== undefined) {
      const username = validateUsername(body.username);
      if (!username.valid) return fail(username.message);
      const taken = await User.findOne({ username: username.value, _id: { $ne: user._id } });
      if (taken) return fail("That username is taken", 409);
      updates.username = username.value;
    }
    if (body.name !== undefined) updates.name = cleanText(body.name, 60);
    if (body.bio !== undefined) updates.bio = cleanText(body.bio, 200);
    if (body.website !== undefined) {
      const website = cleanText(body.website, 200);
      updates.website = !website || /^https:\/\//i.test(website) ? website : "";
    }
    if (body.avatar !== undefined) updates.avatar = String(body.avatar).startsWith("/uploads/") || /^https:\/\//.test(String(body.avatar)) ? String(body.avatar) : "";
    if (body.isPrivate !== undefined) updates.isPrivate = Boolean(body.isPrivate);

    const next = await User.findByIdAndUpdate(user._id, updates, { new: true, runValidators: true });
    return ok(publicUser(next, true));
  } catch (error) {
    return handleError(error);
  }
}
