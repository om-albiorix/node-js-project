// 404
export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: "Route not found" });
}

// Global error handler
export function errorHandler(err, req, res, next) {
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
}
