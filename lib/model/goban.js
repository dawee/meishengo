'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var Mei = require('./mei');
var Stone = require('./stone');
var StoneGroup = require('./stonegroup');


/*
 * Goban model
 *
 * @key size (9 / 13 / 19)
 * @key groups
 */

var Goban = module.exports = Mei.Model.extend({
  defaults: {
    size: 19
  },
  schema: {
    size: Number,
    groups: StoneGroup.Collection,
    history: Stone.Collection
  }
});

/* Return true if stone does not exceed goban bounds limits */

Goban.prototype.insideBounds = function (stone) {
  var row = stone.get('row');
  var col = stone.get('col');

  return row >= 0 &&
    row < this.get('size') &&
    col >= 0 &&
    col < this.get('size');
};

/* Generate the new groups if stone is put */

Goban.prototype.simulatePutStone = function (stone) {
  var immutables = [];
  var mightAttach = [];
  var mightCapture = [];
  var captured = false;
  var newGroup = new StoneGroup();
  var allStones = new Stone.Collection();

  if (!(stone instanceof Stone)) stone = new Stone(stone);
  if (!this.insideBounds(stone)) return false;

  this.get('groups').each(function (group) {
    if (group.canAttach(stone)) {
      mightAttach.push(group.get('stones'));
    } else if (group.touches(stone)) {
      mightCapture.push(group);
    } else {
      immutables.push(group);
    }

    allStones.merge(group.get('stones'));
  }, this);

  if (allStones.hasPos(stone)) return false;
  if (mightAttach.length > 0) {
    newGroup.set('stones', Stone.Collection.union.apply(null, mightAttach));
  }

  newGroup.attach(stone);
  allStones.add(stone);

  immutables.push.apply(immutables, _.filter(mightCapture, function (group) {
    if (group.liberties(allStones, this.get('size')).size() === 0) {
      this.trigger('capture', group);
      allStones.remove(group.get('stones'));
      captured = true;
      return false;
    }

    return true;
  }, this));

  if (!captured && newGroup.liberties(allStones, this.get('size')).size() === 0) {
    return false;
  }

  immutables.push(newGroup);

  return new StoneGroup.Collection(immutables);
};

Goban.prototype.hasStone = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);

  return this.get('groups').any(function (group) {
    return group.get('stones').has(stone);
  });
};

/* Test if stone can be put */

Goban.prototype.canPutStone = function (stone) {
  return !!this.simulatePutStone(stone);
};

/* Put a stone if possible */

Goban.prototype.putStone = function (stone, done) {
  var groups = this.simulatePutStone(stone);

  if (!groups) return false;

  this.set('groups', groups);
  return true;
};

/* Shortcut for range based iterations */

Goban.prototype.range = function () {
  return _.range(0, this.get('size'));
};

/* Iterate over all stones present on the goban */

Goban.prototype.eachStone = function (fn, ctx) {
  this.get('groups').each(function (group) {
    group.get('stones').each(fn, ctx);
  }, ctx);
};
