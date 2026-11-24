import { ok } from "@/lib/api";

export async function GET() {
  return ok({ status: "ok", store: "VoltNest", timestamp: new Date().toISOString() });
}
