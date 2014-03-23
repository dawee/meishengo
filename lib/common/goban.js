var _ = require('underscore');
var events = require('events');


var Goban = module.exports = function (opts) {
  opts = opts || {};
  this.size = opts.size || 19;
  this.intersections = opts.intersections || {};
  this.evts = new events.EventEmitter();
  this.turn = 'black';
};

var goban = Goban.prototype;

goban.on = function (name, cbk) {
  this.evts.on(name, cbk);
};

goban.emit = function (name, data) {
  this.evts.emit(name, data);
};

goban.dump = function () {
  return _.pick(this,
    'intersections',
    'size'
  );
};

goban.canPutStone = function (row, col, color) {
  if (this.turn !== color) return false;
  if(_.has(this.intersections, row) && _.has(this.intersections[row], col)) return false;

  return true;
};

goban.putStone = function (row, col, color) {
  if (!this.canPutStone(row, col, color)) return false;

  this.intersections[row] = this.intersections[row] || {};
  this.intersections[row][col] = color;
  this.turn = (this.turn === 'black' ? 'white' : 'black');
  this.emit('turn:' + color);
  this.emit('put:stone', {row: row, col: col, color: color});
  return true;
};