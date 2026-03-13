import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Routes
import userRoutes from './routes/UserRoute.js';
import postRoutes from './routes/postRoute.js';
import commentRoutes from './routes/commentRoute.js';
import categoryRoutes from './routes/categoryRoute.js';

// Middleware
import { apiLimiter, authLimiter } from './middlewares/rateLimiter.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

// ── SECURITY ──────────────────────────────────────────────────────────────────
app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// ── BODY PARSERS ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── PERFORMANCE ───────────────────────────────────────────────────────────────
app.use(compression());

// ── LOGGING ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// ── RATE LIMITING ─────────────────────────────────────────────────────────────
app.use('/api/', apiLimiter);
app.use('/api/users/login', authLimiter);
app.use('/api/users/signup', authLimiter);

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Blog API operational', version: '1.0.0' });
});

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: '🎉 Blog Backend Running!' });
});

// ── ERROR HANDLING (must be last) ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;