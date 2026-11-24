import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const required = ["MONGO_URI", "ADMIN_EMAIL", "ADMIN_PASSWORD", "ADMIN_NAME"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const adminEmail = process.env.ADMIN_EMAIL.toLowerCase();
    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: process.env.ADMIN_NAME,
        email: adminEmail,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
        role: "admin",
        bio: "Site administrator.",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log("Administrator account ready");
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Could not seed the administrator:", error.message);
    process.exit(1);
  }
};

seedAdmin();
