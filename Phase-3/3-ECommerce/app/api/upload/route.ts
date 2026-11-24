import type { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fail, handleError, ok } from "@/lib/api";
import { assertSameOrigin, requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const allowed = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    await requireAdmin(request);
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File)) return fail("No image uploaded");
    if (file.size > 8 * 1024 * 1024) return fail("Image must be under 8 MB");
    const extension = allowed.get(file.type);
    if (!extension) return fail("Only JPEG, PNG, WebP and GIF are allowed");

    const buffer = Buffer.from(await file.arrayBuffer());
    const signatures: Record<string, number[]> = {
      ".jpg": [0xff, 0xd8, 0xff],
      ".png": [0x89, 0x50, 0x4e, 0x47],
      ".gif": [0x47, 0x49, 0x46, 0x38],
      ".webp": [0x52, 0x49, 0x46, 0x46],
    };
    if (!signatures[extension].every((byte, index) => buffer[index] === byte)) return fail("Invalid image file");

    const directory = path.join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });
    const filename = `${randomBytes(12).toString("hex")}${extension}`;
    await writeFile(path.join(directory, filename), buffer);
    return ok({ url: `/uploads/${filename}`, size: file.size }, 201);
  } catch (error) {
    return handleError(error);
  }
}
