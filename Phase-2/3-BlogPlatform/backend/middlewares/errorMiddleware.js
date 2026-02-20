export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// 404 Not Found middleware
export const notFound = (req, res, next) => {
    const error = new AppError(`🔍 Not Found - ${req.originalUrl}`, 404);
    next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development vs Production error response
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        });
    } else {
        // Production: Don't leak error details
        if (err.isOperational) {
            // Operational, trusted error: send message to client
            res.status(err.statusCode).json({
                success: false,
                status: err.status,
                message: err.message
            });
        } else {
            // Programming or unknown error: don't leak details
            console.error('ERROR 💥', err);
            res.status(500).json({
                success: false,
                status: 'error',
                message: 'Something went wrong!'
            });
        }
    }
};