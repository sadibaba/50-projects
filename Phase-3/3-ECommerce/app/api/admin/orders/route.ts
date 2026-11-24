import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { handleError, ok, pagination } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectDB();
    const { page, limit, skip } = pagination(request, 30, 100);
    const status = new URL(request.url).searchParams.get("status");
    const filter = status && status !== "all" ? ({ status } as any) : {};
    const [orders, total] = await Promise.all([
      Order.find(filter).populate("user", "username name email").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);
    return ok({ orders, total, page, hasMore: skip + orders.length < total });
  } catch (error) {
    return handleError(error);
  }
}
