import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { handleError, ok, pagination } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { page, limit, skip } = pagination(request, 12, 48);
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim();
    const category = url.searchParams.get("category");
    const brand = url.searchParams.get("brand");
    const minParam = url.searchParams.get("min");
    const maxParam = url.searchParams.get("max");
    const min = minParam !== null ? Number(minParam) : NaN;
    const max = maxParam !== null ? Number(maxParam) : NaN;
    const featured = url.searchParams.get("featured");
    const sort = url.searchParams.get("sort") || "new";

    const filter: Record<string, unknown> = {};
    if (q) filter.$or = [{ name: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }, { tags: { $regex: q, $options: "i" } }];
    if (category && category !== "All") filter.category = category;
    if (brand) filter.brand = brand;
    if (Number.isFinite(min) || Number.isFinite(max)) {
      filter.price = { ...(Number.isFinite(min) ? { $gte: min } : {}), ...(Number.isFinite(max) ? { $lte: max } : {}) };
    }
    if (featured === "1") filter.featured = true;

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      new: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      rating: { rating: -1 },
    };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortMap[sort] || sortMap.new).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
    return ok({ products, page, total, hasMore: skip + products.length < total });
  } catch (error) {
    return handleError(error);
  }
}
