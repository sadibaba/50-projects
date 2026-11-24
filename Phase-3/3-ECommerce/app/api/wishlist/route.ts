import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { isObjectId } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    await connectDB();
    const products = await Product.find({ _id: { $in: user.wishlist } }).lean();
    return ok(products);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireUser(request);
    await connectDB();
    const body = await request.json().catch(() => ({}));
    if (!isObjectId(body.productId)) return fail("Invalid product");
    const product = await Product.findById(body.productId);
    if (!product) return fail("Product not found", 404);
    const saved = user.wishlist.some((id) => String(id) === String(product._id));
    if (saved) user.wishlist = user.wishlist.filter((id) => String(id) !== String(product._id));
    else user.wishlist.push(product._id);
    await user.save();
    return ok({ saved: !saved });
  } catch (error) {
    return handleError(error);
  }
}
