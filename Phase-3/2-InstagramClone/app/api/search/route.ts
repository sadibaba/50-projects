import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { handleError, ok } from "@/lib/api";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { buildSavedSet, postShape } from "@/lib/serialize";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const viewer = await getCurrentUser(request);
    const q = new URL(request.url).searchParams.get("q")?.trim() || "";
    if (!q) return ok({ users: [], posts: [] });

    const regex = { $regex: q, $options: "i" };
    const publicUsers = await User.find({ isPrivate: false }).select("_id").lean();
    const [users, posts] = await Promise.all([
      User.find({ $or: [{ username: regex }, { name: regex }] }).limit(8).lean(),
      Post.find({
        author: { $in: publicUsers.map((item: any) => item._id) },
        $or: [{ caption: regex }, { tags: regex }, { location: regex }, { altText: regex }],
      })
        .populate("author", "username name avatar isPrivate")
        .limit(24)
        .lean(),
    ]);

    return ok({
      users: users.map((user: any) => publicUser(user)),
      posts: posts.map((post: any) => postShape(post, viewer ? String(viewer._id) : undefined, buildSavedSet(viewer))),
    });
  } catch (error) {
    return handleError(error);
  }
}
