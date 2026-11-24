export function userSummary(user: any) {
  if (!user) return null;
  return {
    _id: String(user._id),
    username: user.username,
    name: user.name || user.username,
    avatar: user.avatar || "",
    isPrivate: Boolean(user.isPrivate),
  };
}

export function postShape(post: any, viewerId?: string, savedSet: Set<string> = new Set()) {
  const likes = (post.likes || []).map(String);
  return {
    _id: String(post._id),
    imageUrl: post.imageUrl,
    videoUrl: post.videoUrl || "",
    type: post.type || "image",
    caption: post.caption || "",
    altText: post.altText || "",
    location: post.location || "",
    tags: post.tags || [],
    author: userSummary(post.author),
    likesCount: likes.length,
    liked: Boolean(viewerId && likes.includes(String(viewerId))),
    saved: savedSet.has(String(post._id)),
    commentsCount: post.commentsCount || 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export function buildSavedSet(user: any): Set<string> {
  return new Set((user?.savedPosts || []).map(String));
}
