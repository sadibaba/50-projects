import Post from "@/models/Post";
import User from "@/models/User";

export async function getVisiblePost(postId: string, viewerId?: string) {
  const post = await Post.findById(postId).populate("author", "username name avatar isPrivate");
  if (!post) {
    const error = new Error("Post not found") as Error & { status: number };
    error.status = 404;
    throw error;
  }

  const authorId = (post.author as any)._id || post.author;
  const author = await User.findById(authorId).select("isPrivate followers");
  const isOwner = Boolean(viewerId && String(authorId) === String(viewerId));
  const isFollower = Boolean(viewerId && author?.followers.some((id) => String(id) === String(viewerId)));
  if (author?.isPrivate && !isOwner && !isFollower) {
    const error = new Error("Post not found") as Error & { status: number };
    error.status = 404;
    throw error;
  }

  return post;
}
