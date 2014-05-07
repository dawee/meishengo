/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var StoneGroup = require('./stonegroup');


/*
 * Private StoneGroupArray collection
 */

var StoneGroupArray = Backbone.Collection.extend({model: StoneGroup});


/*
 * Transaction model
 *
 * @key gsize
 * @key {Collection:StoneGroup} groups
 * @key {Collection:StoneGroup} attachedTo
 */

var Transaction = module.exports = Backbone.Model.extend();


/* Init the attachedTo Group Array used to concat groups */

Transaction.prototype.initialize = function (opts) {
  this.set('attachedTo', new StoneGroupArray());
};

/* Main call: returns the new Group Array, after stone put (or not) */

Transaction.prototype.putStone = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  
  this.set('stone', stone);

  if (this.exists(stone)) return false;
  this.attachToAll();
  this.mergeGroups();
  this.removeDeadGroups();
  return this.checkLiberties();
};

/* Returns if stone position already taken by other stone */

Transaction.prototype.exists = function (stone) {
  var exists = false;

  this.get('groups').every(function (group) {
    if (group.containsPos(stone)) {
      exists = true;
      return false;
    }

    return true;
  });

  return exists;
};

/* Attach the stone to every possible existing groups */

Transaction.prototype.attachToAll = function (next) {
  this.get('groups').each(function (group) {
    if (group.attach(this.get('stone'))) this.get('attachedTo').add(group);
  }, this);
};

/* A new group is created if the stone cannot be added to a existing one */

Transaction.prototype.newGroup = function () {
  var uniq = new StoneGroup([this.get('stone')]);
  this.get('groups').add(uniq);
  this.get('attachedTo').add(uniq);
};

/* Merge groups when the stone if the stone is attached to both */

Transaction.prototype.mergeGroups = function () {
  if (this.get('attachedTo').size() === 1) return;
  if (this.get('attachedTo').size() === 0) return this.newGroup();

  var eater = this.get('attachedTo').first();
  var food = this.get('attachedTo').rest();

  _.each(food, function (group) {
    eater.eat(group);
  });

  this.set('groups', this.get('groups').filter(function (group) {
    return group.size() > 0;
  }));

  this.get('attachedTo').reset([eater]);
};

/* Return true if the stone is attached to a group with at least one liberty */

Transaction.prototype.checkLiberties = function () {
  var stones = [];

  _.each(this.groups, function (group) {
    stones = _.union(stones, group.toStoneArray());
  });

  return _.size(_.first(this.attachedTo).liberties(stones, this.gsize)) > 0;
};

/* Remove all groups without a liberty */

Transaction.prototype.removeDeadGroups = function () {
  var stones = [];

  _.each(this.groups, function (group) {
    stones = _.union(stones, group.toStoneArray());
  });

  var groups = [];
  _.each(this.groups, function (group, index) {
    if (group.contains(this.stone) || _.size(group.liberties(stones, this.gsize)) > 0) {
      groups.push(group);
    } else {
      this.deadGroups.push(group);
    }
  }, this);

  this.groups = groups;
};
