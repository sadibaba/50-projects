import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./database/db.js";

connectDB();
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
