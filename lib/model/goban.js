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

/* Separate impacted groups from immutables and count stones */

Goban.prototype.calcStoneImpact = function (stone) {
  var impact = {
    immutables: [],
    mightAttach: [],
    mightCapture: [],
    allStones: new Stone.Collection()
  };

  this.get('groups').each(function (group) {
    if (group.canAttach(stone)) {
      impact.mightAttach.push(group.get('stones'));
    } else if (group.touches(stone)) {
      impact.mightCapture.push(group);
    } else {
      impact.immutables.push(group);
    }

    impact.allStones.merge(group.get('stones'));
  }, this);

  return impact;
};

/* Return the new group if stone is put */

Goban.prototype.simulatePutStone = function (stone) {
  var captured = false;
  var newGroup = new StoneGroup();

  if (!(stone instanceof Stone)) stone = new Stone(stone);
  if (!this.insideBounds(stone)) return false;

  var impact = this.calcStoneImpact(stone);

  if (impact.allStones.hasPos(stone)) return false;
  if (impact.mightAttach.length > 0) {
    newGroup.set('stones', Stone.Collection.union.apply(null, impact.mightAttach));
  }

  newGroup.attach(stone);
  impact.allStones.add(stone);
  impact.immutables.push.apply(impact.immutables, _.filter(impact.mightCapture, function (group) {
    if (group.liberties(impact.allStones, this.get('size')).size() === 0) {
      this.trigger('capture', group);
      impact.allStones.remove(group.get('stones'));
      captured = true;
      return false;
    }

    return true;
  }, this));

  if (!captured && newGroup.liberties(impact.allStones, this.get('size')).size() === 0) {
    return false;
  }

  impact.immutables.push(newGroup);
  return new StoneGroup.Collection(impact.immutables);
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
