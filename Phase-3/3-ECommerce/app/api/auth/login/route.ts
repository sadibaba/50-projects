import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { clientKey, fail, handleError, ok } from "@/lib/api";
import { assertSameOrigin, publicUser, rateLimit, setAuthCookie, signToken, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    if (!rateLimit(`login:${clientKey(request)}`, 12, 60_000)) return fail("Too many attempts", 429);
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const user = await User.findOne({ email: String(body.email || "").toLowerCase() }).select("+password");
    if (!user || !(await verifyPassword(String(body.password || ""), user.password))) return fail("Invalid email or password", 401);
    await setAuthCookie(signToken(user));
    return ok({ user: publicUser(user, true) });
  } catch (error) {
    return handleError(error);
  }
}
