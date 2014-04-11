var _ = require('underscore');
var Stone = require('./stone');

var StoneGroup = module.exports = function () {
  var array = _.isArray(arguments[0]) ? arguments[0] : _.toArray(arguments);
  this.stones = {};

  _.each(array, function (stone) {
    if (!(stone instanceof Stone)) stone = new Stone(stone);
    this.stones[stone.toString()] = stone;
  }, this);
};

var group = StoneGroup.prototype;

group.contains = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  return _.has(this.stones, stone.toString());
};

group.containsPos = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);

  var blackStone = new Stone(_.extend(stone.dump(), {color: 'black'}));
  var whiteStone = new Stone(_.extend(stone.dump(), {color: 'white'}));

  return _.has(this.stones, blackStone.toString()) || _.has(this.stones, whiteStone.toString());
};

group.canAttach = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);

  if (this.contains(stone)) return false;
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

group.liberties = function (stones, gsize) {
  var slots = [];
  var allStones = _.union(stones, this.toStoneArray());

  _.each(this.stones, function (stone) {
    slots = _.union(slots, stone.liberties(allStones, gsize));
  });

  return _.uniq(slots, function (stone) {
    return stone.toPosString();
  });
};

group.dump = function () {
  return _.map(_.values(this.stones), function (stone) {
      return stone.dump();
  });
};

group.copy = function () {
  return new StoneGroup(this.dump());
};

group.toStoneArray = function () {
  return _.values(this.stones);
};