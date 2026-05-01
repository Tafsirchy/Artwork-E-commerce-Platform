const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const fs = require("fs");
const path = require("path");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log to file for AI diagnosis
  const logMsg = `\n[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\nError: ${err.message}\nStack: ${err.stack}\nBody: ${JSON.stringify(req.body)}\n`;
  fs.appendFileSync(path.join(__dirname, "../../error_log.txt"), logMsg);

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
