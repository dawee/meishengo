var _ = require('underscore');
var events = require('events');
var Transaction = require('./transaction');
var StoneGroup = require('./stonegroup');
var Stone = require('./stone');

var Goban = module.exports = function (opts) {
  _.bindAll(this, 'emitGroup', 'emitStone', 'reset', 'toggleTurn');
  this.evts = new events.EventEmitter();
  this.reset(opts);
};

var goban = Goban.prototype;

goban.reset = function (opts) {
  this.size = opts.size || 19;
  this.turn = opts.turn || 'black';
  this.prisoners = opts.prisoners || {white: 0, black: 0};
  this.groups = _.map(opts.groups || [], function (group) {
    if (!(group instanceof StoneGroup)) group = new StoneGroup(group);
    return group;
  });
  this.emitAll();
};

goban.emitAll = function () {
  _.each(this.groups, this.emitGroup);
  this.emitPrisoners();
};

goban.emitGroup = function (group) {
  _.each(group.toStoneArray(), this.emitStone);
};

goban.emitStone = function (stone) {
  var data = (stone instanceof Stone) ? stone.dump() : stone;
  this.emit('stone:put', data);
};

goban.emitPrisoners = function () {
  this.emit('prisoners', _.clone(this.prisoners));
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
    prisoners: this.prisoners,
    groups: _.map(this.groups, function (group) {
      return group.dump();
    })
  }
};

goban.canPutStone = function (row, col, color, force) {
  if (!force && this.turn !== color) return false;
  this.transaction = new Transaction(this.groups, this.size);

  return this.transaction.putStone({row: row, col: col, color: color});
};

goban.toggleTurn = function () {
  this.setTurn(this.turn === 'black' ? 'white' : 'black');
};

goban.setTurn = function (color) {
  if (this.turn === color || !_.contains(['black', 'white'], color)) return;
  
  this.turn = color;
  this.emit('turn', {color: color});
  this.emit('turn:' + color);
};

goban.putStone = function (row, col, color, force) {
  if (!this.canPutStone(row, col, color, force)) return false;

  this.groups = this.transaction.groups;
  this.emitStone({row: row, col: col, color: color});

  _.each(this.transaction.deadGroups, function (group) {

    _.each(group.stones, function (stone) {
      this.emit('stone:remove', stone);
      this.prisoners[stone.color]++;
    }, this);

    this.emitPrisoners();
  }, this);

  return true;
};