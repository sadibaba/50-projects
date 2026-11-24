import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { fail, handleError, ok } from "@/lib/api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    if (!product) return fail("Product not found", 404);
    const [reviews, related] = await Promise.all([
      Review.find({ product: product._id }).populate("user", "username name").sort({ createdAt: -1 }).lean(),
      Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4).lean(),
    ]);
    return ok({ product, reviews, related });
  } catch (error) {
    return handleError(error);
  }
}
