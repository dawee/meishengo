var _ = require('underscore');
var Stone = require('./stone');

var StoneGroup = module.exports = function () {
  this.stones = {};

  _.each(_.toArray(arguments), function (stone) {
    if (!(stone instanceof Stone)) stone = new Stone(stone);
    this.stones[stone.toString()] = stone;
  }, this);
};

var group = StoneGroup.prototype;

group.contains = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  return _.has(this.stones, stone.toString());
};

group.canAttach = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  if (this.contains(stone.topStone())) return true;
  if (this.contains(stone.rightStone())) return true;
  if (this.contains(stone.bottomStone())) return true;
  if (this.contains(stone.leftStone())) return true;

  return false;
};

group.attach = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  if (!this.canAttach(stone)) return false;

  this.stones[stone.toString()] = stone;
  return true;
};

group.eat = function (other) {
  _.each(other.stones, function (stone) {
    this.stones[stone.toString()] = stone;
  }, this);

  other.stones = {};
};

group.size = function () {
  return _.size(this.stones);
};