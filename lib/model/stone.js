/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');


/*
 * Stone model
 *
 * @key row (0 .. 18)
 * @key col (0 .. 18)
 * @key color ('white' / 'black')
 */

var Stone = module.exports = Backbone.Model.extend({
  
  row: function () {
    return this.get('row');
  },

  col: function () {
    return this.get('col');
  },

  color: function () {
    return this.get('color');
  },

});

/* Return a string representation of the stone */

Stone.prototype.toString = function () {
  return this.row() + ':' + this.col() + ':' + this.color();
};

/* Return a string representation of the stone, without the color */

Stone.prototype.toPosString = function () {
  return this.row() + ':' + this.col();
};

/* Return a new stone at the top-side of the current one */

Stone.prototype.topStone = function (color) {
  color = color || this.color();
  return new Stone({row: this.row() - 1, col:  this.col(), color:  color});
};

/* Return a new stone at the right-side of the current one */

Stone.prototype.rightStone = function (color) {
  color = color || this.color();
  return new Stone({row: this.row(), col:  this.col() + 1, color:  color});
};

/* Return a new stone at the bottom-side of the current one */

Stone.prototype.bottomStone = function (color) {
  color = color || this.color();
  return new Stone({row: this.row() + 1, col:  this.col(), color:  color});
};

/* Return a new stone at the left-side of the current one */

Stone.prototype.leftStone = function (color) {
  color = color || this.color();
  return new Stone({row: this.row(), col:  this.col() - 1, color:  color});
};

/* Return liberties array within context (stones near and goban size) */

Stone.prototype.liberties = function (stones, gsize) {
  var slots = {
    top: this.topStone(),
    right: this.rightStone(),
    bottom: this.bottomStone(),
    left: this.leftStone()
  };

  if (this.row() === 0) delete slots.top;
  if (this.col() === gsize - 1) delete slots.right;
  if (this.row() === gsize - 1) delete slots.bottom;
  if (this.col() === 0) delete slots.left;

  _.every(stones, function (other) {
    if (!(other.model === Stone)) other = new Stone(other);

    if (this.topStone().equalsPos(other))  delete slots.top;
    if (this.rightStone().equalsPos(other))  delete slots.right;
    if (this.bottomStone().equalsPos(other))  delete slots.bottom;
    if (this.leftStone().equalsPos(other))  delete slots.left;

    return _.size(slots) > 0;
  }, this);

  return _.values(slots);
};

/* Return if other stone equals this one */

Stone.prototype.equals = function (other) {
  if (!(other instanceof Stone)) other = new Stone(other);

  return this.toString() === other.toString();
};

/* Return if other stone is at the same position */

Stone.prototype.equalsPos = function (other) {
  if (!(other instanceof Stone)) other = new Stone(other);

  return this.toPosString() === other.toPosString();
};
