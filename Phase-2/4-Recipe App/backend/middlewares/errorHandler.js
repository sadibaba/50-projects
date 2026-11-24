const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Server error";

  if (process.env.NODE_ENV !== "test") {
    console.error(`[${statusCode}] ${req.method} ${req.originalUrl}: ${message}`);
  }

  res.status(statusCode).json({ message });
};

export const notFound = (req, res, next) => {
  next({
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export default errorHandler;
