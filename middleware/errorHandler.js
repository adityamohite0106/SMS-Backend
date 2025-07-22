const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(error.errors).map(err => err.message);
    message = errors.join(', ');
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  console.error('Error:', error);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;
