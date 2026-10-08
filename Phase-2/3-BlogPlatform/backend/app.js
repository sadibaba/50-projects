import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from './routes/UserRoute.js';
import postRoutes from './routes/postRoute.js';
import commentRoutes from './routes/commentRoute.js';
import categoryRoutes from './routes/categoryRoute.js';

import { apiLimiter, authLimiter } from './middlewares/rateLimiter.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── SECURITY ────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,   // frontend assets ke liye
}));

app.use(cors({
  origin: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// NoSQL injection sanitize
app.use(mongoSanitize());

// XSS sanitize (simple inline — avoid xss-clean deprecation)
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') return obj.replace(/<script[^>]*>.*?<\/script>/gi, '');
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(k => { obj[k] = sanitize(obj[k]); });
    }
    return obj;
  };
  if (req.body) sanitize(req.body);
  next();
});

// ── BODY PARSERS ────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── STATIC FILES ────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',  // 7 din cache
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// ── PERFORMANCE ─────────────────────────────────────────────
app.use(compression({ level: 6, threshold: 1024 }));  // gzip

// ── LOGGING ─────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── RATE LIMITING ───────────────────────────────────────────
app.use('/api/', apiLimiter);
app.use('/api/users/login', authLimiter);
app.use('/api/users/signup', authLimiter);

// ── HEALTH ──────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── ROUTES ──────────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: '  Backend Running!' });
});

// ── ERRORS ──────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;