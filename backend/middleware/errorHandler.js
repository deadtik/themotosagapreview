export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleError(error) {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return {
      error: error.message,
      details: error.details,
      statusCode: error.statusCode
    };
  }

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return {
      error: 'Validation failed',
      details: error.message,
      statusCode: 400
    };
  }

  if (error.message === 'Authentication required') {
    return {
      error: 'Unauthorized',
      statusCode: 401
    };
  }

  if (error.message === 'Admin access required') {
    return {
      error: 'Forbidden',
      statusCode: 403
    };
  }

  // Generic error
  return {
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    statusCode: 500
  };
}
