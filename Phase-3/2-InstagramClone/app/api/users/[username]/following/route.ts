import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { fail, handleError, ok } from "@/lib/api";
import { publicUser } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    await connectDB();
    const user = await User.findOne({ username: username.toLowerCase() }).populate("following");
    if (!user) return fail("User not found", 404);
    return ok((user.following as any[]).map((item) => publicUser(item)));
  } catch (error) {
    return handleError(error);
  }
}
