var _ = require('underscore');

var Goban = module.exports = function (opts) {
  opts = opts || {};
  this.size = opts.size || 13;
  this.intersections = opts.intersections || {};
};

var goban = Goban.prototype;

goban.dump = function () {
  return _.pick(this,
    'intersections',
    'size'
  );
};