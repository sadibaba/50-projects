import type { NextRequest } from "next/server";
import { handleError, ok } from "@/lib/api";
import { assertSameOrigin, clearAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    await clearAuthCookie();
    return ok({ message: "Signed out" });
  } catch (error) {
    return handleError(error);
  }
}
