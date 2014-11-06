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
    size: 19,
    groups: new StoneGroup.Collection()
  },
  schema: {
    size: Number,
    groups: StoneGroup.Collection
  }
});

Goban.prototype.queryStone = function (stone) {
  var found = null;
  if (stone instanceof Stone) stone = stone.toJSON();

  this.get('groups').any(function (group) {
    found = group.get('stones').findWhere(stone);
    return found;
  });

  return found;
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
  if (!stone.insideGobanBounds(this.get('size'))) return false;

  this.get('groups').each(function (group) {
    if (group.touches(stone) && group.color() === stone.get('color')) {
      mightAttach.push(group.get('stones'));
    } else if (group.touches(stone) && group.color() === stone.oppositeColor()) {
      mightCapture.push(group);
    } else {
      immutables.push(group);
    }

    allStones.add(group.get('stones').models);
  }, this);

  if (allStones.hasPos(stone)) return false;
  if (mightAttach.length > 0) {
    newGroup.set('stones', Stone.Collection.union.apply(null, mightAttach));
  }

  if (!newGroup.attach(stone)) return false;

  allStones.add(stone);
  mightCapture = _.filter(mightCapture, function (group) {
    if (group.liberties(allStones, this.get('size')).size() === 0) {
      this.trigger('capture', group);
      allStones.remove(group.get('stones'));
      captured = true;
      return false;
    }

    return true;
  }, this);

  if (!captured && newGroup.liberties(allStones, this.get('size')).size() === 0) {
    return false;
  }

  return new StoneGroup.Collection(
    immutables.concat(mightCapture).concat(newGroup)
  );
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
