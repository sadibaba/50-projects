import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { cleanText, isObjectId } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const productId = String(body.productId || "");
    const rating = Math.round(Number(body.rating));
    const text = cleanText(body.text, 1000);
    if (!isObjectId(productId)) return fail("Invalid product");
    if (rating < 1 || rating > 5) return fail("Rating must be between 1 and 5");
    if (!text) return fail("Review text is required");

    const product = await Product.findById(productId);
    if (!product) return fail("Product not found", 404);

    await Review.findOneAndUpdate(
      { product: product._id, user: user._id },
      { rating, text },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const reviews = await Review.find({ product: product._id }).lean();
    product.rating = Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10;
    product.reviewsCount = reviews.length;
    await product.save();
    return ok({ message: "Review saved", rating: product.rating, reviewsCount: product.reviewsCount });
  } catch (error) {
    return handleError(error);
  }
}
