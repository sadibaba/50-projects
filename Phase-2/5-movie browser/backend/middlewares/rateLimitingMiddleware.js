let requestCount = 0;

export function rateLimiter(req, res, next) {
  requestCount++;
  if (requestCount > 100) {
    return res.status(429).json({ error: "Too many requests" });
  }
  next();
}
