"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { readCart, writeCart, cartTotal, type CartLine } from "@/lib/cart";

interface CartValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | undefined>(undefined);
export const useCart = () => {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    setLines(readCart());
    const sync = () => setLines(readCart());
    window.addEventListener("voltnest:cart", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("voltnest:cart", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const persist = (next: CartLine[]) => {
    setLines(next);
    writeCart(next);
  };

  const add = (line: Omit<CartLine, "quantity">, quantity = 1) => {
    const existing = lines.find((item) => item.productId === line.productId);
    const next = existing
      ? lines.map((item) => item.productId === line.productId ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock, 20) } : item)
      : [...lines, { ...line, quantity: Math.min(quantity, line.stock, 20) }];
    persist(next);
  };

  const setQuantity = (productId: string, quantity: number) => {
    persist(lines.map((line) => line.productId === productId ? { ...line, quantity: Math.max(1, Math.min(quantity, line.stock, 20)) } : line));
  };

  const remove = (productId: string) => persist(lines.filter((line) => line.productId !== productId));
  const clear = () => persist([]);

  return <CartContext.Provider value={{ lines, count: lines.reduce((sum, line) => sum + line.quantity, 0), subtotal: cartTotal(lines), add, setQuantity, remove, clear }}>{children}</CartContext.Provider>;
};
