import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for auth routes
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per hour
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after an hour'
    },
    skipSuccessfulRequests: true,
});

// Post creation limiter
export const postLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 posts per hour
    message: {
        success: false,
        message: 'You have reached the maximum number of posts per hour'
    },
});

// Comment limiter
export const commentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // 30 comments per hour
    message: {
        success: false,
        message: 'You have reached the maximum number of comments per hour'
    },
});