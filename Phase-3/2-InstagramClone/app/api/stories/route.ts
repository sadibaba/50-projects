import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Story from "@/models/Story";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { cleanText, isSafeImageUrl } from "@/lib/validators";

export async function GET() {
  try {
    await connectDB();
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .populate("user", "username name avatar isPrivate")
      .sort({ createdAt: -1 })
      .lean();
    return ok(stories);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const imageUrl = String(body.imageUrl || "").trim();
    if (!isSafeImageUrl(imageUrl)) return fail("A valid image is required");

    const story = await Story.create({
      user: user._id,
      imageUrl,
      caption: cleanText(body.caption, 200),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    const populated = await Story.findById(story._id).populate("user", "username name avatar isPrivate").lean();
    return ok(populated, 201);
  } catch (error) {
    return handleError(error);
  }
}
