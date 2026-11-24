import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { fail, handleError, ok } from "@/lib/api";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { buildSavedSet, postShape } from "@/lib/serialize";

export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    await connectDB();
    const viewer = await getCurrentUser(request);
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return fail("User not found", 404);

    const isOwner = viewer && String(viewer._id) === String(user._id);
    const isFollowing = Boolean(viewer && user.followers.some((id) => String(id) === String(viewer._id)));
    const canView = !user.isPrivate || isOwner || isFollowing;
    const savedSet = buildSavedSet(viewer);

    const [posts, saved] = await Promise.all([
      canView
        ? Post.find({ author: user._id }).populate("author", "username name avatar isPrivate").sort({ createdAt: -1 }).lean()
        : Promise.resolve([]),
      isOwner
        ? Post.find({ _id: { $in: user.savedPosts } }).populate("author", "username name avatar isPrivate").sort({ createdAt: -1 }).lean()
        : Promise.resolve([]),
    ]);

    return ok({
      user: publicUser(user, Boolean(isOwner)),
      posts: posts.map((post: any) => postShape(post, viewer ? String(viewer._id) : undefined, savedSet)),
      saved: saved.map((post: any) => postShape(post, viewer ? String(viewer._id) : undefined, savedSet)),
      followersCount: user.followers.length,
      followingCount: user.following.length,
      totalLikes: posts.reduce((total: number, post: any) => total + (post.likes?.length || 0), 0),
      isFollowing,
      canView,
    });
  } catch (error) {
    return handleError(error);
  }
}
