const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const securityMiddleware = (app) => {
    // Set security HTTP headers
    app.use(helmet());

    // CORS configuration
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        optionsSuccessStatus: 200
    }));

    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());

    // Data sanitization against XSS
    app.use(xss());

    // Prevent parameter pollution
    app.use(hpp({
        whitelist: ['category', 'tags', 'sort'] // Allow duplicate parameters
    }));
};

module.exports = securityMiddleware;