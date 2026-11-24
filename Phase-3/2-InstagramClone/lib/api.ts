import { NextRequest, NextResponse } from "next/server";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleError(error: unknown) {
  const err = error as { status?: number; message?: string };
  const status = err.status || 500;
  if (status >= 500 && process.env.NODE_ENV !== "test") console.error(error);
  return fail(err.message || "Something went wrong", status);
}

export function pagination(request: NextRequest, defaultLimit = 12, maxLimit = 30) {
  const url = new URL(request.url);
  const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || defaultLimit, 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
}

export function clientKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
