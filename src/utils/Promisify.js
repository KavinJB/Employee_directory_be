/**
 * Wraps an asynchronous route handler to automatically forward errors to Express error handling middleware.
 * This helps avoid repetitive try-catch blocks in every controller.
 *
 * @param {function} handler - An async route handler function (controller method)
 * @returns {function} A function that wraps the handler and forwards any rejected promises to `next()`
 */
const Promisify = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

export default Promisify;
