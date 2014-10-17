'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var Mei = require('./mei');
var Stone = require('./stone');


/*
 * Private StoneArray collection
 */

var StoneArray = Mei.Collection.extend({model: Stone});


/*
 * StoneGroup model
 *
 * @key stones
 */

var StoneGroup = module.exports = Mei.Model.extend({
  schema: {
    stones: StoneArray
  }
});


/* Init the StoneArray key */

StoneGroup.prototype.initialize = function (opts) {
  var array = Array.isArray(opts) ? opts : (!!opts && opts.stones) || [];

  this.set('stones', new StoneArray(array));
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
  var slots = [];
  var allStones = _.union(stones, this.get('stones').toJSON());

  this.get('stones').each(function (stone) {
    slots = _.union(slots, stone.liberties(allStones, gsize));
  });

  return _.uniq(slots, function (stone) {
    return stone.toPosString();
  });
};

/* Shortcut to stones size */

StoneGroup.prototype.size = function () {
  return this.get('stones').size();
};