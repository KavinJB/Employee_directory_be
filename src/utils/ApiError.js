/**
 * Generic API Error class to standardize error responses throughout the application.
 */
class ApiError {
  /**
   * Constructs a new ApiError instance.
   * @param {number} [statusCode=500] - HTTP status code (e.g., 400, 500)
   * @param {string} [message='Something went wrong'] - Human-readable error message
   * @param {Array} [errors] - Optional list of detailed error messages or validation issues
   * @param {string} [stack=''] - Optional stack trace for debugging (useful in dev environments)
   */
  constructor(statusCode = 500, message = 'Something went wrong', errors, stack = '') {
    this.statusCode = statusCode;
    this.data = null;           // Always null for error responses
    this.message = message;
    this.success = false;       // Marks this as an unsuccessful response
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
