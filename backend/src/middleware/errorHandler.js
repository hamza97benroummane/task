

const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[${new Date().toISOString()}] ${status} ${message}`);
    if (process.env.NODE_ENV === 'development') {
      console.error(err.stack);
    }
  }

  res.status(status).json({
    status,
    message,
  });
};

module.exports = { notFound, errorHandler };