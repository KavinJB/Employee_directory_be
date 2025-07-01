/**
 * Generic API response wrapper to standardize successful responses.
 */
class ApiResponse {
  /**
   * Constructs a standardized API response.
   * @param {number} statusCode - HTTP status code (e.g. 200, 201)
   * @param {*} data - Actual data to return in the response
   * @param {string} [message='Success'] - Optional custom success message
   */
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Success if statusCode is below 400
  }
}

export { ApiResponse };
