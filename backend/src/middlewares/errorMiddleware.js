const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};



const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log to console for Vercel logging
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.error(`Error: ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(`Stack: ${err.stack}`);
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
