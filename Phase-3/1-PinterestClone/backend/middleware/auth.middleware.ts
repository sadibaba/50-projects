import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/http";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : "";
  if (!token) return next(new ApiError(401, "Authentication required"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    (req as any).userId = decoded.id;
    next();
  } catch {
    next(new ApiError(401, "Session is invalid or expired"));
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : "";
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    (req as any).userId = decoded.id;
  } catch {
    // Guests can still browse.
  }
  next();
};
