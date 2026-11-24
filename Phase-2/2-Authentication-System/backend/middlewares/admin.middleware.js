import { ApiError } from "../utils/http.js";

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(new ApiError(403, "Administrator access required"));
  }
  next();
};

export default adminMiddleware;
