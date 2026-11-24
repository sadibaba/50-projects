import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import { fail, handleError, ok, pagination } from "@/lib/api";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { cleanText, normalizeCoupon } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    await connectDB();
    const { page, limit, skip } = pagination(request, 20, 50);
    const filter = user.role === "admin" ? {} : { user: user._id };
    const [orders, total] = await Promise.all([
      Order.find(filter).populate("user", "username name email").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);
    return ok({ orders, total, page, hasMore: skip + orders.length < total });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const lines = Array.isArray(body.items) ? body.items : [];
    if (!lines.length) return fail("Cart is empty");

    const productIds = lines.map((line: any) => String(line.productId));
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== new Set(productIds).size) return fail("One or more products no longer exist");

    let subtotal = 0;
    const items = [] as any[];
    for (const line of lines) {
      const product = products.find((item) => String(item._id) === String(line.productId));
      const quantity = Math.max(1, Math.min(Number(line.quantity) || 1, 20));
      if (!product) return fail("Product not found");
      if (product.stock < quantity) return fail(`${product.name} only has ${product.stock} left in stock`);
      subtotal += product.price * quantity;
      items.push({ product: product._id, name: product.name, price: product.price, quantity, image: product.images[0] || "" });
    }

    let discount = 0;
    let coupon = "";
    const code = normalizeCoupon(body.coupon);
    if (code) {
      const found = await Coupon.findOne({ code, active: true });
      if (!found) return fail("Invalid coupon code");
      if (found.expiresAt && found.expiresAt < new Date()) return fail("Coupon has expired");
      if (subtotal < found.minTotal) return fail(`Coupon requires a minimum order of $${found.minTotal}`);
      discount = Math.round(subtotal * (found.percent / 100) * 100) / 100;
      coupon = found.code;
    }

    const shipping = subtotal - discount >= 199 ? 0 : 12;
    const total = Math.round((subtotal - discount + shipping) * 100) / 100;
    const address = {
      line1: cleanText(body.address?.line1, 120),
      city: cleanText(body.address?.city, 60),
      postalCode: cleanText(body.address?.postalCode, 20),
      country: cleanText(body.address?.country, 60),
    };
    if (!address.line1 || !address.city || !address.country) return fail("A complete shipping address is required");

    const number = `VN-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 90 + 10)}`;
    const order = await Order.create({
      number,
      user: user._id,
      items,
      subtotal,
      discount,
      shipping,
      total,
      coupon,
      status: "processing",
      paymentMethod: body.paymentMethod === "cod" ? "cod" : "card",
      address,
    });

    await Promise.all(items.map((item) => Product.updateOne({ _id: item.product, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } })));
    return ok(order, 201);
  } catch (error) {
    return handleError(error);
  }
}
