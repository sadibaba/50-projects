import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";
import { fail, handleError, ok } from "@/lib/api";
import { normalizeCoupon, parsePrice } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const code = normalizeCoupon(body.code);
    const subtotal = parsePrice(body.subtotal);
    const coupon = await Coupon.findOne({ code, active: true });
    if (!coupon) return fail("Invalid coupon code", 404);
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return fail("Coupon has expired");
    if (subtotal < coupon.minTotal) return fail(`Minimum order is $${coupon.minTotal}`);
    return ok({ code: coupon.code, percent: coupon.percent, discount: Math.round(subtotal * coupon.percent) / 100 });
  } catch (error) {
    return handleError(error);
  }
}
