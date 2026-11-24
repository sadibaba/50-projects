import { ok } from "@/lib/api";

export async function GET() {
  return ok({ status: "ok", timestamp: new Date().toISOString() });
}
