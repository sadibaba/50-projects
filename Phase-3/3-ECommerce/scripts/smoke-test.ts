const BASE = process.env.BASE_URL || "http://localhost:3002";
let cookie = "";
async function call(path: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(cookie ? { cookie } : {}), ...(options.headers || {}) },
  });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}
async function main() {
  console.log("health", (await call("/api/health")).status);
  console.log("products", (await call("/api/products?limit=3")).body.products?.length);
  const login = await call("/api/auth/login", { method: "POST", body: JSON.stringify({ email: "customer@voltnest.dev", password: "demo12345" }) });
  console.log("login", login.status);
  const products = (await call("/api/products?limit=1")).body.products;
  const order = await call("/api/orders", { method: "POST", body: JSON.stringify({ items: [{ productId: products[0]._id, quantity: 1 }], address: { line1: "Test 1", city: "Lahore", country: "Pakistan" }, paymentMethod: "cod" }) });
  console.log("order", order.status, order.body.number);
  console.log("wishlist", (await call("/api/wishlist", { method: "PUT", body: JSON.stringify({ productId: products[0]._id }) })).status);
  console.log("logout", (await call("/api/auth/logout", { method: "POST" })).status);
}
main().catch((error) => { console.error(error); process.exit(1); });
