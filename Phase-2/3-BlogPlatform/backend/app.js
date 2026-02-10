import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import userRoutes from './routes/UserRoute.js';
import postRoutes from './routes/postRoute.js';
import commentRoutes from './routes/commentRoute.js';
import categoryRoutes from './routes/categoryRoute.js';

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);


app.get("/", (req, res) => {
  res.send("Blog Backend Running...");
});

export default app;