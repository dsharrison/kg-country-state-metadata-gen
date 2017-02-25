/*
 * Serve JSON to our AngularJS client
 */

/**
 * Retrieve country and state codes from the stored json data.
 */
exports.codes = function(req, res) {
  res.json(require('../data/sf-codes'));
}
