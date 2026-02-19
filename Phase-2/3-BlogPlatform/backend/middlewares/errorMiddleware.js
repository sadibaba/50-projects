const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development vs Production error response
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production: Don't leak error details
        res.status(err.statusCode).json({
            status: err.status,
            message: err.isOperational ? err.message : 'Something went wrong!'
        });
    }
};

// Handle 404 errors
const notFoundMiddleware = (req, res, next) => {
    const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(error);
};

export default { errorMiddleware, notFoundMiddleware };