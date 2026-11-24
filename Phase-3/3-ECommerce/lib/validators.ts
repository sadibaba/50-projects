export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Result = { valid: true; value: string } | { valid: false; message: string };

export function validateUsername(value: unknown): Result {
  const username = String(value || "").trim().toLowerCase();
  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    return { valid: false, message: "Username must be 3-30 characters using letters, numbers or underscores" };
  }
  return { valid: true, value: username };
}

export function validateEmail(value: unknown): Result {
  const email = String(value || "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) return { valid: false, message: "Enter a valid email address" };
  return { valid: true, value: email };
}

export function validatePassword(value: unknown): Result {
  const password = String(value || "");
  if (password.length < 8) return { valid: false, message: "Password must be at least 8 characters" };
  if (password.length > 100) return { valid: false, message: "Password is too long" };
  return { valid: true, value: password };
}

export function validateSlug(value: unknown): Result {
  const slug = String(value || "").trim().toLowerCase();
  if (!SLUG_PATTERN.test(slug)) return { valid: false, message: "Slug must use lowercase letters, numbers and single hyphens" };
  return { valid: true, value: slug };
}

export function cleanText(value: unknown, maxLength = 2000): string {
  return String(value || "").replace(/\u0000/g, "").trim().slice(0, maxLength);
}

export function parsePrice(value: unknown): number {
  const price = Number(value);
  if (!Number.isFinite(price) || price < 0) return -1;
  return Math.round(price * 100) / 100;
}

export function isSafeImageUrl(value: unknown): boolean {
  const url = String(value || "").trim();
  if (!url) return false;
  if (url.startsWith("/uploads/")) return /^\/uploads\/[a-z0-9._-]+$/i.test(url);
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export function isObjectId(value: unknown): boolean {
  return /^[a-f0-9]{24}$/i.test(String(value || ""));
}

export function normalizeCoupon(value: unknown): string {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 24);
}
