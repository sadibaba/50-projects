import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { handleError, ok } from "@/lib/api";
import { getCurrentUser, publicUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(request);
    return ok({ user: user ? publicUser(user, true) : null });
  } catch (error) {
    return handleError(error);
  }
}
