var _ = require('underscore');
var events = require('events');
var Transaction = require('./transaction');

var Goban = module.exports = function (opts) {
  opts = opts || {};
  this.size = opts.size || 19;
  // TODO : Managing imports of goban groups
  this.groups = [];
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
    'size'
  );
};

goban.canPutStone = function (row, col, color) {
  if (this.turn !== color) return false;
  this.transaction = new Transaction(this.groups, this.size);

  return this.transaction.putStone({row: row, col: col, color: color});
};

goban.putStone = function (row, col, color) {
  if (!this.canPutStone(row, col, color)) return false;

  this.groups = this.transaction.groups;
  this.turn = (this.turn === 'black' ? 'white' : 'black');
  this.emit('turn:' + color);
  this.emit('stone:put', {row: row, col: col, color: color});
  return true;
};