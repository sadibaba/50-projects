import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/mongo.db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from'./routes/message.routes.js'

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;