/**
 * Packages response payload for successful request
 * @param {String} message
 * @param {*} body
 */
module.exports.onSuccess = function (message, body) {
  return { success: true, msg: message, body: body, error: null };
};

/**
 * Packages response payload for failed request
 * @param {String} message
 * @param {*} error
 */
module.exports.onFailure = function (message, error) {
  return { success: false, msg: message, body: null, error: error };
};

module.exports.patchOptions = { new: true, runValidators: true };
