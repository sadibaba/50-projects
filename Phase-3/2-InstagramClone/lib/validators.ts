export const USERNAME_PATTERN = /^[a-z0-9._]{3,30}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Result = { valid: true; value: string } | { valid: false; message: string };

export function validateUsername(value: unknown): Result {
  const username = String(value || "").trim().toLowerCase();
  if (!USERNAME_PATTERN.test(username)) {
    return { valid: false, message: "Username must be 3-30 characters using letters, numbers, dots or underscores" };
  }
  if (username.startsWith(".") || username.endsWith(".") || username.includes("..")) {
    return { valid: false, message: "Username cannot start or end with a dot, or contain two dots" };
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

export function cleanText(value: unknown, maxLength = 2200): string {
  return String(value || "").replace(/\u0000/g, "").trim().slice(0, maxLength);
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
