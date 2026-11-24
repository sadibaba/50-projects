import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { fail, handleError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

const statuses = ["processing", "packed", "shipped", "delivered", "cancelled"];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    await connectDB();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    if (!statuses.includes(body.status)) return fail("Invalid order status");
    const order = await Order.findByIdAndUpdate(id, { status: body.status }, { new: true });
    if (!order) return fail("Order not found", 404);
    return ok(order);
  } catch (error) {
    return handleError(error);
  }
}
