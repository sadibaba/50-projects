export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export const CART_KEY = "voltnest_cart";

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("voltnest:cart"));
}

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.price * line.quantity, 0);
}
