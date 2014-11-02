'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var Mei = require('./mei');


var MAX_GOBAN_SIZE = 19;

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

Stone.prototype.liberties = function (stones, gsize, liberties) {
  if (!(stones instanceof Stone.Collection)) stones = new Stone.Collection(stones);
  liberties = liberties || new Stone.Collection([]);

  var slots = {
    top: this.topStone(),
    right: this.rightStone(),
    bottom: this.bottomStone(),
    left: this.leftStone()
  };

  if (this.get('row') !== 0 && !stones.hasPos(slots.top)) liberties.merge(slots.top);
  if (this.get('col') !== gsize - 1 && !stones.hasPos(slots.right)) liberties.merge(slots.right);
  if (this.get('row') !== gsize - 1 && !stones.hasPos(slots.bottom)) liberties.merge(slots.bottom);
  if (this.get('col') !== 0 && !stones.hasPos(slots.left)) liberties.merge(slots.left);

  return liberties;
};

/* Return if other stone equals this one */

Stone.prototype.equals = function (other) {
  if (!(other instanceof Stone)) other = new Stone(other);

  return this.get('row') === other.get('row') &&
    this.get('col') === other.get('col') &&
    this.get('color') === other.get('color');
};

/* Return if other stone is at the same position */

Stone.prototype.equalsPos = function (other) {
  if (!(other instanceof Stone)) other = new Stone(other);

  return this.get('row') === other.get('row') &&
    this.get('col') === other.get('col');
};


/*
 * Array of stone, feeds a stone index
 */

Stone.Collection = Mei.Collection.extend({model: Stone});


/* Reset the index */

Stone.Collection.prototype.intialize = function (stones) {
  this.index = new Array(MAX_GOBAN_SIZE * MAX_GOBAN_SIZE);
  _.each(stones, this.feedIndex, this);
  this.on('add', _.bind(this.feedIndex, this));
  this.on('remove', _.bind(this.freeIndexSlot, this));  
};

/* Store a stone into the index */

Stone.Collection.prototype.feedIndex = function (stone) {
  if (_.isArray(stone)) return _.each(stone, this.feedIndex, this);
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  this.index[MAX_GOBAN_SIZE * stone.get('row') + stone.get('col')] = stone.get('color');
};

/* Set the stone slot to null into index */

Stone.Collection.prototype.freeIndexSlot = function (stone) {
  if (_.isArray(stone)) return _.each(stone, this.freeIndexSlot, this);
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  this.index[MAX_GOBAN_SIZE * stone.get('row') + stone.get('col')] = null;
};

/* Reset the index */

Stone.Collection.prototype.reset = function (stones) {
  Mei.Collection.prototype.reset.apply(this, [stones]);
  this.index = new Array(MAX_GOBAN_SIZE * MAX_GOBAN_SIZE);
  _.each(stones, this.feedIndex, this);
};

/* Search a stone into the index */

Stone.Collection.prototype.has = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  return this.index[MAX_GOBAN_SIZE * stone.get('row') + stone.get('col')] === stone.get('color');
};

/* Search a stone position into the index */

Stone.Collection.prototype.hasPos = function (stone) {
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  return !!this.index[MAX_GOBAN_SIZE * stone.get('row') + stone.get('col')];
};

/* Add stone(s) only if not included yet */

Stone.Collection.prototype.merge = function (stone) {
  if (_.isArray(stone)) return _.each(stone, this.merge, this);
  if (!this.has(stone)) this.add(stone);
};


/*
 * Static helpers
 */

/* Concat n collections on a new one */

Stone.Collection.concat = function () {
  var result = new Stone.Collection([]);

  _.toArray(arguments).forEach(function (collection) {
    result.add(collection.models);
  });

  return result;
};