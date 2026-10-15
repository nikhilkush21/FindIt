/**
 * Centralised error handler — must be the last app.use() in server.js.
 * Never leaks stack traces to clients in production.
 */
const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  console.error('[ErrorHandler]', err);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({ message: `${field} is already in use` });
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  // Multer file size / type
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
  }
  if (err.message?.includes('Images only') || err.message?.includes('Only image')) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = errorHandler;
