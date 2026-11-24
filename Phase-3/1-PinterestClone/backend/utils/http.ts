export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const publicUser = (user: any, includeEmail = false) => ({
  _id: user._id,
  username: user.username,
  name: user.name || user.username,
  ...(includeEmail ? { email: user.email } : {}),
  bio: user.bio || "",
  avatar: user.avatar || "",
  cover: user.cover || "",
  website: user.website || "",
  location: user.location || "",
  followers: user.followers || [],
  following: user.following || [],
  createdAt: user.createdAt,
});

export const parsePage = (page: unknown, limit: unknown, max = 50) => {
  const p = Math.max(Number(page) || 1, 1);
  const l = Math.min(Math.max(Number(limit) || 20, 1), max);
  return { page: p, limit: l, skip: (p - 1) * l };
};
