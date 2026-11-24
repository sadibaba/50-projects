import { ApiError } from "../utils/http.js";

export default function clientId(req, res, next) {
  const value = req.header("x-client-id");

  if (!value || value.length < 8 || value.length > 128) {
    return next(
      new ApiError(400, "A valid x-client-id header is required for this request")
    );
  }

  req.clientId = value;
  next();
}
