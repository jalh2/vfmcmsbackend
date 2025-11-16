const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[ErrorHandler] ${req.method} ${req.originalUrl} - ${statusCode}`);
    console.error('Message:', err.message);
    if (err.stack) {
      console.error(err.stack);
    }
  }

  res.status(statusCode);
  res.json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
