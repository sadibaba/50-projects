import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { ApiError, asyncHandler } from "../utils/http.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Session is invalid or has expired");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "Account no longer exists");
  }

  req.user = { id: user._id.toString(), role: user.role };
  next();
});

export default authMiddleware;
