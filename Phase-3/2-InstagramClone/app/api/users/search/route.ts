import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { handleError, ok } from "@/lib/api";
import { publicUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const q = new URL(request.url).searchParams.get("q")?.trim() || "";
    if (!q) return ok([]);
    const users = await User.find({
      $or: [{ username: { $regex: q, $options: "i" } }, { name: { $regex: q, $options: "i" } }],
    })
      .limit(12)
      .lean();
    return ok(users.map((user: any) => publicUser(user)));
  } catch (error) {
    return handleError(error);
  }
}
