var Stone = module.exports = function (opt) {
  this.row = opt.row;
  this.col = opt.col;
  this.color = opt.color;
};

var stone = Stone.prototype;

stone.toString = function () {
  return this.row + ':' + this.col + ':' + this.color;
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

stone.equals = function (stone) {
  return stone.toString() === this.toString();
};