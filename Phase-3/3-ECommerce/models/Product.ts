import mongoose, { Schema, model, models, type Model } from "mongoose";

export interface IProduct {
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
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: { type: String, default: "VoltNest", trim: true },
    category: { type: String, required: true, index: true },
    description: { type: String, default: "", maxlength: 4000 },
    price: { type: Number, required: true, min: 0 },
    compareAt: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    specs: [{ label: String, value: String }],
    tags: [{ type: String, lowercase: true }],
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

const Product: Model<IProduct> = models.Product || model<IProduct>("Product", productSchema);
export default Product;
