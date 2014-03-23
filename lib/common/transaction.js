var _ = require('underscore');
var events = require('events');
var StoneGroup = require('./stonegroup');
var Stone = require('./stone');


var Transaction = module.exports = function (groups, gsize) {
  this.attachedTo = [];
  this.groups = _.map(groups, function (group) {
    if (!(group instanceof StoneGroup)) return new StoneGroup(group);
    return group.copy();
  });
  this.gsize = gsize;
  this.evts = new events.EventEmitter();
};

var transaction = Transaction.prototype;

transaction.on = function (name, cbk) {
  this.evts.on(name, cbk);
};

transaction.emit = function (name, data) {
  this.evts.emit(name, data);
};

transaction.putStone = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  this.stone = stone;

  if (this.exists(stone)) return false;
  this.attachToAll();
  this.mergeGroups();
  return this.checkLiberties();
};

transaction.exists = function (stone) {
  var exists = false;

  _.every(this.groups, function (group) {
    if (group.contains(stone)) {
      exists = true;
      return false;
    }

    return true;
  });

  return exists;
};

transaction.attachToAll = function (next) {
  _.each(this.groups, function (group) {
    if (group.attach(this.stone)) this.attachedTo.push(group);
  }, this);
};

transaction.mergeGroups = function () {
  if (this.attachedTo.length === 1) return;

  if (this.attachedTo.length === 0) {
    var uniq = new StoneGroup(this.stone);
    this.groups.push(uniq);
    this.attachedTo.push(uniq);
    return;
  }

  var eater = _.first(this.attachedTo);
  var food = _.rest(this.attachedTo);

  _.each(food, function (group) {
    eater.eat(group);
  });

  this.groups = _.filter(this.groups, function (group) {
    return group.size() > 0;
  });

  this.attachedTo = [eater];
};

transaction.checkLiberties = function () {
  var stones = [];

  _.each(this.groups, function (group) {
    stones = _.union(stones, group.toStoneArray());
  });

  return _.first(this.attachedTo).liberties(stones, this.gsize) > 0;
};

