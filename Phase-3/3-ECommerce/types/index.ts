export interface User {
  _id: string;
  username: string;
  name: string;
  email?: string;
  role: "customer" | "admin";
  phone: string;
  address: { line1: string; city: string; postalCode: string; country: string };
  wishlist: string[];
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  compareAt: number;
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  specs: { label: string; value: string }[];
  tags: string[];
  createdAt: string;
}

export interface Review {
  _id: string;
  product: string;
  user: { _id: string; username: string; name: string };
  rating: number;
  text: string;
  createdAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  number: string;
  user: User | { _id: string; username: string; name: string; email: string };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: string;
  status: "processing" | "packed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "card" | "cod";
  address: { line1: string; city: string; postalCode: string; country: string };
  createdAt: string;
}
