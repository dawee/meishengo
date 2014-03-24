var _ = require('underscore');
var events = require('events');
var Transaction = require('./transaction');
var StoneGroup = require('./stonegroup');
var Stone = require('./stone');

var Goban = module.exports = function (opts) {
  _.bindAll(this, 'emitGroup', 'emitStone', 'reset');
  this.evts = new events.EventEmitter();
  this.reset(opts);
};

var goban = Goban.prototype;

goban.reset = function (opts) {
  this.size = opts.size || 19;
  this.turn = opts.turn || 'black';
  this.groups = _.map(opts.groups || [], function (group) {
    if (!(group instanceof StoneGroup)) group = new StoneGroup(group);
    return group;
  });
  this.emitAll();
};

goban.emitAll = function () {
  _.each(this.groups, this.emitGroup);
};

goban.emitGroup = function (group) {
  _.each(group.toStoneArray(), this.emitStone);
};

goban.emitStone = function (stone) {
  var data = (stone instanceof Stone) ? stone.dump() : stone;
  this.emit('stone:put', data);
};

goban.on = function (name, cbk) {
  this.evts.on(name, cbk);
};

goban.emit = function (name, data) {
  this.evts.emit(name, data);
};

goban.dump = function () {
  return {
    size: this.size,
    turn: this.turn,
    groups: _.map(this.groups, function (group) {
      return group.dump();
    })
  }
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
  this.emitStone({row: row, col: col, color: color});
  _.each(this.transaction.deadGroups, function (group) {
    _.each(group.stones, function (stone) {
      this.emit('stone:remove', stone);
    }, this);
  }, this);
  return true;
};