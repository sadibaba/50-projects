import jwt from "jsonwebtoken";
import { ApiError } from "../utils/http.js";

export default function auth(req, res, next) {
  const header = req.header("Authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    next(new ApiError(401, "Session is invalid or has expired"));
  }
}
