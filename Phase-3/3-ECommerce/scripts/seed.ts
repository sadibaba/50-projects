import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Product from "../models/Product";
import Order from "../models/Order";
import Review from "../models/Review";
import Coupon from "../models/Coupon";

const img = (id: string) => `https://images.unsplash.com/photo-${id}?q=80&w=900&auto=format&fit=crop`;

const catalog = [
  { name: "NestBook Air 14", slug: "nestbook-air-14", category: "Laptops", brand: "VoltNest", price: 1199, compareAt: 1349, stock: 14, featured: true, images: [img("1496181133206-80ce9b88a853")], description: "A thin, quiet laptop for writing, design and long days away from a charger. 14-inch display, all-day battery and a keyboard worth typing on.", specs: [{ label: "Display", value: "14.2-inch 3K" }, { label: "Memory", value: "16 GB" }, { label: "Storage", value: "512 GB SSD" }], tags: ["laptop", "work"] },
  { name: "Pulse Studio Headphones", slug: "pulse-studio-headphones", category: "Audio", brand: "Pulse", price: 249, compareAt: 299, stock: 32, featured: true, images: [img("1505740420928-5e560c06d30e")], description: "Closed-back wireless headphones tuned for long listening sessions. Warm low end, clear mids and 40 hours of battery.", specs: [{ label: "Battery", value: "40 hours" }, { label: "Driver", value: "40 mm" }], tags: ["headphones", "audio"] },
  { name: "Halo Phone 2", slug: "halo-phone-2", category: "Phones", brand: "Halo", price: 899, compareAt: 0, stock: 21, featured: true, images: [img("1511707171634-5f897ff02aa9")], description: "A clean Android phone with a calm interface, excellent cameras and five years of updates.", specs: [{ label: "Display", value: "6.4-inch OLED" }, { label: "Storage", value: "256 GB" }], tags: ["phone", "mobile"] },
  { name: "Arc Watch S", slug: "arc-watch-s", category: "Wearables", brand: "Arc", price: 279, compareAt: 319, stock: 7, featured: false, images: [img("1523275335684-37898b6baf30")], description: "A minimal health watch with a bright always-on display and a week of battery.", specs: [{ label: "Battery", value: "7 days" }, { label: "Water", value: "5 ATM" }], tags: ["watch", "fitness"] },
  { name: "Frame X100 Camera", slug: "frame-x100-camera", category: "Cameras", brand: "Frame", price: 1399, compareAt: 0, stock: 4, featured: true, images: [img("1516035069371-29a1b244cc32")], description: "A compact fixed-lens camera with tactile dials and a film-inspired colour profile.", specs: [{ label: "Sensor", value: "APS-C" }, { label: "Lens", value: "35 mm f/2" }], tags: ["camera", "photography"] },
  { name: "Echo Mini Speaker", slug: "echo-mini-speaker", category: "Audio", brand: "Echo", price: 89, compareAt: 109, stock: 44, featured: false, images: [img("1608043152269-423dbba4e7e1")], description: "A pocketable speaker with surprising low end and a recycled aluminium shell.", specs: [{ label: "Battery", value: "18 hours" }], tags: ["speaker", "audio"] },
  { name: "Type 75 Keyboard", slug: "type-75-keyboard", category: "Desk", brand: "Type", price: 159, compareAt: 189, stock: 18, featured: true, images: [img("1587829741301-dc798b83add3")], description: "A compact 75% mechanical keyboard with hot-swap switches and a quiet, solid case.", specs: [{ label: "Layout", value: "75%" }, { label: "Connection", value: "USB-C / Bluetooth" }], tags: ["keyboard", "desk"] },
  { name: "Glide Mouse", slug: "glide-mouse", category: "Desk", brand: "Type", price: 69, compareAt: 0, stock: 26, featured: false, images: [img("1527864550417-7fd91fc51a46")], description: "A lightweight wireless mouse with a silent click and a sculpted shape for long sessions.", specs: [{ label: "Weight", value: "68 g" }, { label: "Battery", value: "70 days" }], tags: ["mouse", "desk"] },
  { name: "Canvas 27 Monitor", slug: "canvas-27-monitor", category: "Monitors", brand: "Canvas", price: 549, compareAt: 629, stock: 9, featured: true, images: [img("1527443224154-c4a3942d3acf")], description: "A 27-inch 4K monitor with accurate colour and a single-cable USB-C setup.", specs: [{ label: "Panel", value: "27-inch 4K IPS" }, { label: "Ports", value: "USB-C 90 W" }], tags: ["monitor", "desk"] },
  { name: "Nova Console", slug: "nova-console", category: "Gaming", brand: "Nova", price: 499, compareAt: 0, stock: 12, featured: false, images: [img("1606144042614-b2417e99c4e3")], description: "A quiet next-gen console for the living room, with a controller that finally fits.", specs: [{ label: "Storage", value: "1 TB" }, { label: "Output", value: "4K 120 Hz" }], tags: ["gaming", "console"] },
];

async function main() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
  await mongoose.connect(process.env.MONGO_URI);
  if (await Product.countDocuments()) {
    console.log("Seed skipped: products already exist");
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create({ username: "admin", email: "admin@voltnest.dev", name: "Saad", role: "admin", password: await bcrypt.hash("admin12345", 12) });
  const customer = await User.create({ username: "customer", email: "customer@voltnest.dev", name: "Demo Customer", role: "customer", phone: "+92 300 0000000", password: await bcrypt.hash("demo12345", 12), address: { line1: "12 Gulberg Lane", city: "Lahore", postalCode: "54000", country: "Pakistan" } });

  const products = await Product.insertMany(catalog.map((item) => ({ ...item, rating: 0, reviewsCount: 0 })));
  await Coupon.insertMany([
    { code: "SETUP15", percent: 15, minTotal: 400, active: true },
    { code: "WELCOME10", percent: 10, minTotal: 100, active: true },
  ]);

  const reviewTexts = ["Exactly what I needed. Build quality is excellent.", "Arrived quickly and works beautifully.", "Great value for the price.", "A thoughtful design that feels made to last."];
  for (let index = 0; index < 4; index += 1) {
    await Review.create({ product: products[index]._id, user: index % 2 === 0 ? customer._id : admin._id, rating: 5 - (index % 2), text: reviewTexts[index] });
    const reviews = await Review.find({ product: products[index]._id });
    products[index].rating = Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10;
    products[index].reviewsCount = reviews.length;
    await products[index].save();
  }

  const orderItems = [
    { product: products[0]._id, name: products[0].name, price: products[0].price, quantity: 1, image: products[0].images[0] },
    { product: products[1]._id, name: products[1].name, price: products[1].price, quantity: 1, image: products[1].images[0] },
  ];
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  await Order.create({ number: "VN-10000001", user: customer._id, items: orderItems, subtotal, discount: 0, shipping: 0, total: subtotal, status: "delivered", paymentMethod: "card", address: customer.address, createdAt: new Date(Date.now() - 4 * 86400000) });
  await Order.create({ number: "VN-10000002", user: customer._id, items: [{ product: products[2]._id, name: products[2].name, price: products[2].price, quantity: 1, image: products[2].images[0] }], subtotal: products[2].price, discount: 0, shipping: 12, total: products[2].price + 12, status: "shipped", paymentMethod: "cod", address: customer.address });

  console.log(`Seeded ${products.length} products, 2 orders and 2 users`);
  console.log("Admin: admin@voltnest.dev / admin12345");
  console.log("Customer: customer@voltnest.dev / demo12345");
  await mongoose.disconnect();
}

main().catch(async (error) => { console.error(error); await mongoose.disconnect(); process.exit(1); });
