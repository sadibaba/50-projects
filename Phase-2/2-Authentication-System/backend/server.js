import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./database/db.js";
import  cors from 'cors';
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cors({
  origin: true, 
  credentials: true
}));
dotenv.config();

connectDB(); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
