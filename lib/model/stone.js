/*
 * Module dependencies
 */

var _ = require('underscore');
var Mei = require('./mei');


/*
 * Stone model
 *
 * @key row (0 .. 18)
 * @key col (0 .. 18)
 * @key color ('white' / 'black')
 */

var Stone = module.exports = Mei.Model.extend({
  defaults: {
    latest: false
  },
  schema: {
    row: Number,
    col: Number,
    color: String,
    latest: Boolean
  }
});


/* Return a string representation of the stone */

Stone.prototype.toString = function () {
  return this.get('row') + ':' + this.get('col') + ':' + this.get('color');
};

/* Return a string representation of the stone, without the color */

Stone.prototype.toPosString = function () {
  return this.get('row') + ':' + this.get('col');
};

/* Return a new stone at the top-side of the current one */

Stone.prototype.topStone = function (color) {
  color = color || this.get('color');
  return new Stone({row: this.get('row') - 1, col:  this.get('col'), color:  color});
};

/* Return a new stone at the right-side of the current one */

Stone.prototype.rightStone = function (color) {
  color = color || this.get('color');
  return new Stone({row: this.get('row'), col:  this.get('col') + 1, color:  color});
};

/* Return a new stone at the bottom-side of the current one */

Stone.prototype.bottomStone = function (color) {
  color = color || this.get('color');
  return new Stone({row: this.get('row') + 1, col:  this.get('col'), color:  color});
};

/* Return a new stone at the left-side of the current one */

Stone.prototype.leftStone = function (color) {
  color = color || this.get('color');
  return new Stone({row: this.get('row'), col:  this.get('col') - 1, color:  color});
};

/* Return liberties array within context (stones near and goban size) */

Stone.prototype.liberties = function (stones, gsize) {
  var slots = {
    top: this.topStone(),
    right: this.rightStone(),
    bottom: this.bottomStone(),
    left: this.leftStone()
  };

  if (this.get('row') === 0) delete slots.top;
  if (this.get('col') === gsize - 1) delete slots.right;
  if (this.get('row') === gsize - 1) delete slots.bottom;
  if (this.get('col') === 0) delete slots.left;

  _.every(stones, function (other) {
    if (!(other instanceof Stone)) other = new Stone(other);

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

  return this.get('row') === other.get('row')
    && this.get('col') === other.get('col')
    && this.get('color') === other.get('color');
};

/* Return if other stone is at the same position */

Stone.prototype.equalsPos = function (other) {
  if (!(other instanceof Stone)) other = new Stone(other);

  return this.get('row') === other.get('row')
    && this.get('col') === other.get('col');
};
