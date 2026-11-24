import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { fail, handleError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { cleanText, isSafeImageUrl, parsePrice } from "@/lib/validators";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    await connectDB();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = cleanText(body.name, 140);
    if (body.category !== undefined) updates.category = cleanText(body.category, 60);
    if (body.brand !== undefined) updates.brand = cleanText(body.brand, 60);
    if (body.description !== undefined) updates.description = cleanText(body.description, 4000);
    if (body.price !== undefined) updates.price = Math.max(parsePrice(body.price), 0);
    if (body.compareAt !== undefined) updates.compareAt = Math.max(parsePrice(body.compareAt), 0);
    if (body.stock !== undefined) updates.stock = Math.max(Number(body.stock) || 0, 0);
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);
    if (body.images !== undefined) {
      if (!Array.isArray(body.images) || !body.images.length || !body.images.every(isSafeImageUrl)) return fail("Invalid images");
      updates.images = body.images.slice(0, 6);
    }
    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!product) return fail("Product not found", 404);
    return ok(product);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    await connectDB();
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return ok({ message: "Product deleted" });
  } catch (error) {
    return handleError(error);
  }
}
