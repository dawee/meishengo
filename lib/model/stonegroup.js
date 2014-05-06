/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var Stone = require('./stone');


/*
 * StoneGroup collection
 *
 * @model Stone
 */

var StoneGroup = module.exports = Backbone.Collection.extend({model: Stone});


/* Check if an equivalent stone is in the collection */

StoneGroup.prototype.contains = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);

  return this.any(function (other) {
    return stone.equals(other);
  });
};

/* Check if a stone with equivalent position is in the collection */

StoneGroup.prototype.containsPos = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);

  return this.any(function (other) {
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

  this.add(stone);
  return true;
};

/* Add all other group stones, and empty it */

StoneGroup.prototype.eat = function (other) {
  var self = this;

  other.each(function (stone) {
    self.add(stone);
  });

  other.reset();
};

/* Return the array of group liberties (stone liberties union) */

StoneGroup.prototype.liberties = function (stones, gsize) {
  var slots = [];
  var allStones = _.union(stones, this.toJSON());

  this.each(function (stone) {
    slots = _.union(slots, stone.liberties(allStones, gsize));
  });

  return _.uniq(slots, function (stone) {
    return stone.toPosString();
  });
};
