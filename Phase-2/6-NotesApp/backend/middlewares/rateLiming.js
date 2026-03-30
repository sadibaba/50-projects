import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  message: "Too many requests, please try again later.",
});

// Apply to all routes
app.use(limiter);
