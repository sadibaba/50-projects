import mongoose, { Schema, model, models, type Model, type Types } from "mongoose";

export interface IOrder {
  number: string;
  user: Types.ObjectId;
  items: { product: Types.ObjectId; name: string; price: number; quantity: number; image: string }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: string;
  status: "processing" | "packed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "card" | "cod";
  address: { line1: string; city: string; postalCode: string; country: string };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    number: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: { type: String, default: "" },
    status: { type: String, enum: ["processing", "packed", "shipped", "delivered", "cancelled"], default: "processing" },
    paymentMethod: { type: String, enum: ["card", "cod"], default: "card" },
    address: {
      line1: String,
      city: String,
      postalCode: String,
      country: String,
    },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> = models.Order || model<IOrder>("Order", orderSchema);
export default Order;
