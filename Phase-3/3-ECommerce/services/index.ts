import { api } from "./api";
import type { Order, Product, Review, User } from "@/types";

export const authApi = {
  me: () => api.get<{ user: User | null }>("/api/auth/me"),
  login: (body: { email: string; password: string }) => api.post<{ user: User }>("/api/auth/login", body),
  register: (body: { username: string; email: string; password: string; name?: string }) => api.post<{ user: User }>("/api/auth/register", body),
  logout: () => api.post<{ message: string }>("/api/auth/logout"),
  updateProfile: (body: Record<string, unknown>) => api.patch<User>("/api/auth/profile", body),
};

export const productApi = {
  list: (params: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => value !== undefined && query.set(key, String(value)));
    return api.get<{ products: Product[]; page: number; total: number; hasMore: boolean }>(`/api/products?${query}`);
  },
  get: (slug: string) => api.get<{ product: Product; reviews: Review[]; related: Product[] }>(`/api/products/${slug}`),
  categories: () => api.get<{ name: string; count: number }[]>("/api/categories"),
};

export const cartApi = {
  validateCoupon: (code: string, subtotal: number) => api.post<{ code: string; percent: number; discount: number }>("/api/coupons/validate", { code, subtotal }),
  checkout: (body: Record<string, unknown>) => api.post<Order>("/api/orders", body),
  myOrders: () => api.get<{ orders: Order[] }>("/api/orders"),
  order: (id: string) => api.get<Order>(`/api/orders/${id}`),
};

export const reviewApi = {
  add: (body: { productId: string; rating: number; text: string }) => api.post<{ message: string }>("/api/reviews", body),
};

export const wishlistApi = {
  list: () => api.get<Product[]>("/api/wishlist"),
  toggle: (productId: string) => api.put<{ saved: boolean }>("/api/wishlist", { productId }),
};

export const adminApi = {
  stats: () => api.get<any>("/api/admin/stats"),
  products: () => api.get<Product[]>("/api/admin/products"),
  createProduct: (body: Record<string, unknown>) => api.post<Product>("/api/admin/products", body),
  updateProduct: (id: string, body: Record<string, unknown>) => api.put<Product>(`/api/admin/products/${id}`, body),
  deleteProduct: (id: string) => api.delete<{ message: string }>(`/api/admin/products/${id}`),
  orders: () => api.get<{ orders: Order[] }>("/api/admin/orders"),
  updateOrder: (id: string, status: string) => api.patch<Order>(`/api/admin/orders/${id}`, { status }),
  upload: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post<{ url: string }>("/api/upload", form);
  },
};
