import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { handleError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectDB();
    const [products, customers, orders, revenue, lowStock, recent, top] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.countDocuments(),
      Order.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      Product.find({ stock: { $lte: 5 } }).select("name slug stock images price").limit(6).lean(),
      Order.find().populate("user", "username name").sort({ createdAt: -1 }).limit(6).lean(),
      Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.name", units: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
        { $sort: { units: -1 } },
        { $limit: 5 },
      ]),
    ]);
    return ok({ products, customers, orders, revenue: revenue[0]?.total || 0, lowStock, recent, top });
  } catch (error) {
    return handleError(error);
  }
}
