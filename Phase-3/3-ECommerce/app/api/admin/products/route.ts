import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { fail, handleError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { cleanText, isSafeImageUrl, parsePrice, validateSlug } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectDB();
    return ok(await Product.find().sort({ createdAt: -1 }).lean());
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const name = cleanText(body.name, 140);
    const slug = validateSlug(body.slug);
    const category = cleanText(body.category, 60);
    const price = parsePrice(body.price);
    if (!name) return fail("Product name is required");
    if (!slug.valid) return fail(slug.message);
    if (!category) return fail("Category is required");
    if (price < 0) return fail("Price must be a positive number");
    if (!Array.isArray(body.images) || !body.images.length || !body.images.every(isSafeImageUrl)) return fail("Add at least one valid image");

    const product = await Product.create({
      name,
      slug: slug.value,
      category,
      brand: cleanText(body.brand || "VoltNest", 60),
      description: cleanText(body.description, 4000),
      price,
      compareAt: Math.max(parsePrice(body.compareAt) || 0, 0),
      images: body.images.slice(0, 6),
      stock: Math.max(Number(body.stock) || 0, 0),
      featured: Boolean(body.featured),
      tags: Array.isArray(body.tags) ? body.tags.map((tag: unknown) => cleanText(tag, 30).toLowerCase()).filter(Boolean).slice(0, 12) : [],
      specs: Array.isArray(body.specs) ? body.specs.filter((spec: any) => spec?.label && spec?.value).slice(0, 12) : [],
    });
    return ok(product, 201);
  } catch (error) {
    return handleError(error);
  }
}
