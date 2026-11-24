export const logger = (req, res, next) => {
  if (process.env.NODE_ENV === "test") return next();

  const startedAt = Date.now();
  res.on("finish", () => {
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`
    );
  });
  next();
};
