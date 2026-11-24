import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { handleError, ok } from "@/lib/api";
import { getCurrentUser, publicUser } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const viewer = await getCurrentUser(request);
    const users = await User.find(viewer ? { _id: { $nin: [viewer._id, ...viewer.following] } } : {})
      .sort({ followers: -1 })
      .limit(5)
      .lean();
    return ok(users.map((user: any) => publicUser(user)));
  } catch (error) {
    return handleError(error);
  }
}
