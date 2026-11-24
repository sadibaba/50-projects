import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import User from "@/models/User";

export const COOKIE_NAME = "vn_token";

export function signToken(user: { _id: unknown; role: string }): string {
  return jwt.sign({ id: String(user._id), role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
}

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function publicUser(user: any, includeEmail = false) {
  if (!user) return null;
  return {
    _id: String(user._id),
    username: user.username,
    name: user.name || user.username,
    ...(includeEmail ? { email: user.email } : {}),
    role: user.role,
    phone: user.phone || "",
    address: user.address || {},
    wishlist: (user.wishlist || []).map(String),
    createdAt: user.createdAt,
  };
}

export async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { id: string };
    return await User.findById(decoded.id);
  } catch {
    return null;
  }
}

export async function requireUser(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    const error = new Error("Authentication required") as Error & { status: number };
    error.status = 401;
    throw error;
  }
  return user;
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireUser(request);
  if (user.role !== "admin") {
    const error = new Error("Administrator access required") as Error & { status: number };
    error.status = 403;
    throw error;
  }
  return user;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const entry = attempts.get(key) ?? { count: 0, resetAt: now + windowMs };
  if (entry.resetAt < now) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  attempts.set(key, entry);
  return entry.count <= limit;
}

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const host = request.headers.get("host");
  const allowed = new Set(
    [process.env.NEXT_PUBLIC_APP_URL, host ? `http://${host}` : null, host ? `https://${host}` : null].filter(Boolean)
  );
  if (!allowed.has(origin)) {
    const error = new Error("Cross-origin request blocked") as Error & { status: number };
    error.status = 403;
    throw error;
  }
}
