import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id).populate("user", "username name email").lean();
    if (!order) return fail("Order not found", 404);
    if (user.role !== "admin" && String(order.user?._id || order.user) !== String(user._id)) return fail("Order not found", 404);
    return ok(order);
  } catch (error) {
    return handleError(error);
  }
}
