var _ = require('underscore');


var Stone = module.exports = function (opt) {
  this.row = opt.row;
  this.col = opt.col;
  this.color = opt.color;
};

var stone = Stone.prototype;

stone.toString = function () {
  return this.row + ':' + this.col + ':' + this.color;
};

stone.toPosString = function () {
  return this.row + ':' + this.col;
};

stone.topStone = function (color) {
  color = color || this.color;
  return new Stone({row: this.row - 1, col:  this.col, color:  color});
};

stone.rightStone = function (color) {
  color = color || this.color;
  return new Stone({row: this.row, col:  this.col + 1, color:  color});
};

stone.bottomStone = function (color) {
  color = color || this.color;
  return new Stone({row: this.row + 1, col:  this.col, color:  color});
};

stone.leftStone = function (color) {
  color = color || this.color;
  return new Stone({row: this.row, col:  this.col - 1, color:  color});
};

stone.liberties = function (stones, gsize) {
  var slots = {
    top: this.topStone(),
    right: this.rightStone(),
    bottom: this.bottomStone(),
    left: this.leftStone()
  };

  if (this.row === 0) delete slots.top;
  if (this.col === gsize - 1) delete slots.right;
  if (this.row === gsize - 1) delete slots.bottom;
  if (this.col === 0) delete slots.left;

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

stone.equals = function (other) {
  return this.toString() === other.toString();
};

stone.equalsPos = function (other) {
  return this.toPosString() === other.toPosString();
};

stone.dump = function () {
  return _.pick(this, 'row', 'col', 'color');
};