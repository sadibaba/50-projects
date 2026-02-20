import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import "express-async-errors";

// Import routes
import userRoutes from './routes/UserRoute.js';
import postRoutes from './routes/postRoute.js';
import commentRoutes from './routes/commentRoute.js';
import categoryRoutes from './routes/categoryRoute.js';

// Import middleware
import { apiLimiter, authLimiter } from './middlewares/rateLimiter.js';
import { protect } from './middlewares/authMiddleware.js';

// Import error handling middleware
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// Import logger
import logger from './config/logger.js';

const app = express();

// 🔒 SECURITY MIDDLEWARE
// Set security HTTP headers
app.use(helmet());

// Enable CORS with options
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));

// 📦 BODY PARSERS
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 🚀 PERFORMANCE MIDDLEWARE
// Compress all responses
app.use(compression());

// 🛡️ DATA SANITIZATION against NoSQL query injection
app.use(mongoSanitize());

// 🛡️ DATA SANITIZATION against XSS
app.use(xss());

// 🛡️ Prevent parameter pollution
app.use(hpp({
    whitelist: ['category', 'tags', 'sort', 'page', 'limit'] // Allow these parameters to be duplicated
}));

// 📝 LOGGING MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    // Production logging
    app.use(morgan('combined', {
        stream: { write: message => logger.info(message.trim()) }
    }));
}

// Custom request logger
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url} - ${req.ip}`);
    next();
});

// ⏱️ RATE LIMITING
// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Stricter rate limiting for auth routes
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);
app.use('/api/users/forgotpassword', authLimiter);

// 🏥 HEALTH CHECK ENDPOINT (No rate limiting)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        uptime: process.uptime()
    });
});

// 📊 API STATUS ENDPOINT
app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Blog API is operational',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            posts: '/api/posts',
            comments: '/api/comments',
            categories: '/api/categories'
        }
    });
});

// 🚦 API ROUTES
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);

// 📄 STATIC FILES (if needed)
// app.use('/uploads', express.static('public/uploads'));

// 🏠 ROOT ROUTE
app.get("/", (req, res) => {
    res.status(200).json({
        message: "🎉 Blog Backend Running Successfully!",
        environment: process.env.NODE_ENV,
        documentation: "/api/status",
        health: "/health"
    });
});

// ❌ 404 HANDLER - Must be after all routes
app.use(notFound);

// 🚨 GLOBAL ERROR HANDLER - Must be last
app.use(errorHandler);

export default app;