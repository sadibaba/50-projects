import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { handleError, ok } from "@/lib/api";
import { publicUser, requireUser } from "@/lib/auth";
import { cleanText } from "@/lib/validators";

export async function PATCH(request: NextRequest) {
  try {
    const current = await requireUser(request);
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = cleanText(body.name, 60);
    if (body.phone !== undefined) updates.phone = cleanText(body.phone, 30);
    if (body.address !== undefined) {
      updates.address = {
        line1: cleanText(body.address.line1, 120),
        city: cleanText(body.address.city, 60),
        postalCode: cleanText(body.address.postalCode, 20),
        country: cleanText(body.address.country, 60),
      };
    }
    const user = await User.findByIdAndUpdate(current._id, updates, { new: true });
    return ok(publicUser(user, true));
  } catch (error) {
    return handleError(error);
  }
}
