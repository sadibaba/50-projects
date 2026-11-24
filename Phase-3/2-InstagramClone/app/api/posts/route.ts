import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import { handleError, ok, pagination } from "@/lib/api";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { buildSavedSet, postShape } from "@/lib/serialize";
import { cleanText, isSafeImageUrl } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const viewer = await getCurrentUser(request);
    const savedSet = buildSavedSet(viewer);
    const { page, limit, skip } = pagination(request, 12, 30);
    const url = new URL(request.url);
    const scope = url.searchParams.get("scope") || "explore";
    const username = url.searchParams.get("username");
    const type = url.searchParams.get("type");

    const filter: Record<string, unknown> = {};
    if (type === "video") filter.type = "video";

    if (scope === "user" && username) {
      const target = await User.findOne({ username: username.toLowerCase() });
      if (!target) return ok({ posts: [], page, hasMore: false });
      const isOwner = viewer && String(viewer._id) === String(target._id);
      const isFollower = viewer && target.followers.some((id: unknown) => String(id) === String(viewer._id));
      if (target.isPrivate && !isOwner && !isFollower) {
        return ok({ posts: [], page, hasMore: false, private: true });
      }
      filter.author = target._id;
    } else if (scope === "saved") {
      if (!viewer) return ok({ posts: [], page, hasMore: false });
      filter._id = { $in: viewer.savedPosts };
    } else if (scope === "feed" && viewer) {
      filter.author = { $in: [...viewer.following, viewer._id] };
    } else {
      const publicUsers = await User.find({ isPrivate: false }).select("_id").lean();
      filter.author = { $in: publicUsers.map((user: any) => user._id) };
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "username name avatar isPrivate")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    return ok({
      posts: posts.map((post: any) => postShape(post, viewer ? String(viewer._id) : undefined, savedSet)),
      page,
      total,
      hasMore: skip + posts.length < total,
    });
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
    const videoUrl = String(body.videoUrl || "").trim();

    if (!isSafeImageUrl(imageUrl)) {
      const error = new Error("Choose a valid image from the uploader or a public image picker") as Error & { status: number };
      error.status = 400;
      throw error;
    }
    if (videoUrl && !/^https:\/\//i.test(videoUrl)) {
      const error = new Error("Video URL must use HTTPS") as Error & { status: number };
      error.status = 400;
      throw error;
    }

    const caption = cleanText(body.caption, 2200);
    if (!caption && !body.altText) {
      const error = new Error("Add a caption or alt text so the post is accessible") as Error & { status: number };
      error.status = 400;
      throw error;
    }

    const tags: string[] = Array.from(
      new Set<string>(
        (Array.isArray(body.tags) ? body.tags : String(body.tags || "").split(","))
          .map((tag: unknown) => String(tag).replace(/^#/, "").trim().toLowerCase())
          .filter(Boolean)
          .slice(0, 20)
      )
    );

    const post = await Post.create({
      author: user._id,
      imageUrl,
      videoUrl,
      type: videoUrl ? "video" : "image",
      caption,
      altText: cleanText(body.altText, 300),
      location: cleanText(body.location, 100),
      tags,
    });

    const populated = await Post.findById(post._id).populate("author", "username name avatar isPrivate").lean();
    return ok(postShape(populated, String(user._id), buildSavedSet(user)), 201);
  } catch (error) {
    return handleError(error);
  }
}
