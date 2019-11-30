/**
 * Sends error to the client in a standarized way.
 * @param {Object} res HTTP response object
 * @param {String} message Error message to send.
 * @param {?Number} status HTTP status code, default to 400.
 */
export function sendError(res, message, status) {
  res.status(status || 400).send({
    error: true,
    message,
  });
}
