import mongoose, { Schema, model, models, type Model } from "mongoose";

export interface ICoupon {
  code: string;
  percent: number;
  minTotal: number;
  active: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    percent: { type: Number, required: true, min: 1, max: 80 },
    minTotal: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    expiresAt: Date,
  },
  { timestamps: true }
);

const Coupon: Model<ICoupon> = models.Coupon || model<ICoupon>("Coupon", couponSchema);
export default Coupon;
