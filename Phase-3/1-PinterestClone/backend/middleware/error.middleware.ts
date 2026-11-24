import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next({ status: 404, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((item: any) => item.message).join(", ");
  }
  if (err.name === "CastError") {
    status = 400;
    message = "Invalid resource id";
  }
  if (err.code === 11000) {
    status = 409;
    message = "That value is already in use";
  }

  if (process.env.NODE_ENV !== "test") console.error(`[${status}] ${message}`);
  res.status(status).json({ error: message });
};
