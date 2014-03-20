var _ = require('underscore');

var Goban = module.exports = function (opts) {
  opts = opts || {};
  this.size = opts.size || 19;
  this.intersections = opts.intersections || {};
};

var goban = Goban.prototype;

goban.dump = function () {
  return _.pick(this,
    'intersections',
    'size'
  );
};

goban.putStone = function (row, col, color) {
  if(_.has(this.intersections, row) && _.has(this.intersections[row], col)) return false;

  this.intersections[row] = this.intersections[row] || {};
  this.intersections[row][col] = color;
  return true;
};