import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import pinRoutes from "./routes/pin.routes";
import boardRoutes from "./routes/board.routes";
import userRoutes from "./routes/user.routes"
import { errorMiddleware } from "./middleware/error.middleware";
import feedRoutes from "./routes/feed.routes";
import commentRoutes from "./routes/comment.routes";
import notificationRoutes from "./routes/notification.routes";
import searchRoutes from "./routes/search.routes";
import unsplashRoutes from "./routes/unsplash.routes";
import imageRoutes from "./routes/image.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/users", userRoutes); 
app.use("/api/search", searchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/unsplash", unsplashRoutes);
app.use("/api/images", imageRoutes);

// Error handler (last middleware)
app.use(errorMiddleware);

export default app;
