/*
 * Serve JSON to our AngularJS client
 */

exports.iso_3166_2 = function(req, res) {
  res.json(require('../data/iso_3166_2'));
}
