'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var Mei = require('./mei');
var Stone = require('./stone');
var StoneGroup = require('./stonegroup');


/*
 * Private Array collections
 */

var StoneGroupArray = Mei.Collection.extend({model: StoneGroup});
var StoneArray = Mei.Collection.extend({model: Stone});


/*
 * Transaction model
 *
 * @key gsize
 * @key {Collection:StoneGroup} groups
 * @key {Collection:StoneGroup} attachedTo
 */

var Transaction = module.exports = Mei.Model.extend();


/* Init the attachedTo Group Array used to concat groups */

Transaction.prototype.initialize = function (opts) {
  this.set('attachedTo', new StoneGroupArray());
  this.set('deads', new StoneArray());
};

/* Main call: returns the new Group Array, after stone put (or not) */

Transaction.prototype.putStone = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  
  this.set('stone', stone);

  if (stone.get('row') < 0 || stone.get('row') >= this.get('gsize')) return false;
  if (stone.get('col') < 0 || stone.get('col') >= this.get('gsize')) return false;
  if (this.exists(stone)) return false;

  this.attachToAll();
  this.mergeGroups();
  this.removeDeadGroups();
  return this.checkLiberties();
};

/* Returns if stone position already taken by other stone */

Transaction.prototype.exists = function (stone) {
  return this.get('groups').any(function (group) {
    return group.containsPos(stone);
  });
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

  this.get('groups').reset(this.get('groups').filter(function (group) {
    return group.size() > 0;
  }));

  this.get('attachedTo').reset([eater]);
};

/* Return true if the stone is attached to a group with at least one liberty */

Transaction.prototype.checkLiberties = function () {
  var stones = [];

  this.get('groups').each(function (group) {
    stones = _.union(stones, group.get('stones').toJSON());
  });

  return _.size(this.get('attachedTo').first().liberties(stones, this.get('gsize'))) > 0;
};

/* Remove all groups without a liberty and the current stone */

Transaction.prototype.removeDeadGroups = function () {
  var stones = [];

  this.get('groups').each(function (group) {
    stones = _.union(stones, group.get('stones').toJSON());
  });

  this.get('groups').reset(this.get('groups').filter(function (group) {
    var isCurrentStoneGroup = group.contains(this.get('stone'));
    var hasAtLeastOneLiberty = _.size(group.liberties(stones, this.get('gsize'))) > 0;

    if (isCurrentStoneGroup || hasAtLeastOneLiberty) {
      return true;
    } else {
      group.get('stones').each(this.get('deads').add, this.get('deads'));
    }

  }, this));
};
