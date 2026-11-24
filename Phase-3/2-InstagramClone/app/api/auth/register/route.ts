import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { clientKey, fail, handleError, ok } from "@/lib/api";
import { assertSameOrigin, hashPassword, publicUser, rateLimit, setAuthCookie, signToken } from "@/lib/auth";
import { validateEmail, validatePassword, validateUsername } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    if (!rateLimit(`register:${clientKey(request)}`, 8, 60_000)) return fail("Too many attempts. Try again later.", 429);
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const username = validateUsername(body.username);
    if (!username.valid) return fail(username.message);
    const email = validateEmail(body.email);
    if (!email.valid) return fail(email.message);
    const password = validatePassword(body.password);
    if (!password.valid) return fail(password.message);

    const exists = await User.findOne({ $or: [{ username: username.value }, { email: email.value }] });
    if (exists) return fail(exists.email === email.value ? "An account with this email already exists" : "That username is taken", 409);

    const user = await User.create({
      username: username.value,
      email: email.value,
      name: String(body.name || username.value).slice(0, 60),
      password: await hashPassword(password.value),
    });

    await setAuthCookie(signToken(user));
    return ok({ user: publicUser(user, true) }, 201);
  } catch (error) {
    return handleError(error);
  }
}
