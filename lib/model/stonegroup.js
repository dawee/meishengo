'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var Mei = require('./mei');
var Stone = require('./stone');


/*
 * StoneGroup model
 *
 * @key stones
 */

var StoneGroup = module.exports = Mei.Model.extend({
  schema: {
    stones: Stone.Collection
  }
});


/* Init the Stone Collection */

StoneGroup.prototype.initialize = function (opts) {
  var array = Array.isArray(opts) ? opts : (!!opts && opts.stones) || [];

  this.set('stones', new Stone.Collection(array));
};

/* Check if an equivalent stone is in the collection */

StoneGroup.prototype.contains = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);

  return this.get('stones').any(function (other) {
    return stone.equals(other);
  });
};

/* Check if a stone with equivalent position is in the collection */

StoneGroup.prototype.containsPos = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);

  return this.get('stones').any(function (other) {
    return stone.equalsPos(other);
  });
};

/* Check if stone can be attached to the group */

StoneGroup.prototype.canAttach = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);

  if (this.contains(stone)) return false;
  if (this.contains(stone.topStone())) return true;
  if (this.contains(stone.rightStone())) return true;
  if (this.contains(stone.bottomStone())) return true;
  if (this.contains(stone.leftStone())) return true;

  return false;
};

/* Attach (add) a stone to the collection, if possible */

StoneGroup.prototype.attach = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  if (!this.canAttach(stone)) return false;

  this.get('stones').add(stone);
  return true;
};

/* Add all other group stones, and empty it */

StoneGroup.prototype.eat = function (other) {
  var self = this;

  other.get('stones').each(function (stone) {
    self.get('stones').add(stone);
  });

  other.get('stones').reset();
};

/* Return the array of group liberties (stone liberties union) */

StoneGroup.prototype.liberties = function (stones, gsize) {
  if (!(stones instanceof Stone.Collection)) stones = new Stone.Collection(stones);

  var liberties = new Stone.Collection([]);
  var allStones = Stone.Collection.union(stones, this.get('stones'));

  this.get('stones').each(function (stone) {
    stone.liberties(allStones, gsize, liberties);
  });

  return liberties;
};

/* Return true if the group touches this stone */

StoneGroup.prototype.touches = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);

  var stones = this.get('stones');

  return stones.hasPos(stone.topStone())
   || stones.hasPos(stone.rightStone())
   || stones.hasPos(stone.bottomStone())
   || stones.hasPos(stone.leftStone());
};

/* Shortcut to stones size */

StoneGroup.prototype.size = function () {
  return this.get('stones').size();
};


/*
 * Array of groups, feeds a group index
 */

StoneGroup.Collection = Mei.Collection.extend({model: StoneGroup});
