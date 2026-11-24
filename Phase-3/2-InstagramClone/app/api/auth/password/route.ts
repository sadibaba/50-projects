import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { clientKey, fail, handleError, ok } from "@/lib/api";
import { assertSameOrigin, hashPassword, rateLimit, requireUser, verifyPassword } from "@/lib/auth";
import { validatePassword } from "@/lib/validators";

export async function PUT(request: NextRequest) {
  try {
    assertSameOrigin(request);
    if (!rateLimit(`password:${clientKey(request)}`, 6, 60_000)) return fail("Too many attempts. Try again later.", 429);
    const current = await requireUser(request);
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const user = await User.findById(current._id).select("+password");
    if (!user || !(await verifyPassword(String(body.currentPassword || ""), user.password))) {
      return fail("Current password is incorrect", 401);
    }
    const next = validatePassword(body.newPassword);
    if (!next.valid) return fail(next.message);

    user.password = await hashPassword(next.value);
    await user.save();
    return ok({ message: "Password updated" });
  } catch (error) {
    return handleError(error);
  }
}
