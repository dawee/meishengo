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

/* Return the opposite color of the stone */

Stone.prototype.oppositeColor = function () {
  return this.get('color') === 'black' ? 'white' : 'black';
};

/* Return same position but opposite color stone */

Stone.prototype.oppositeStone = function () {
  return new Stone({
    row: this.get('row'),
    col: this.get('col'),
    color: this.oppositeColor()
  });
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

/* Return true if stone does not exceed goban bounds limits */

Stone.prototype.insideGobanBounds = function (gsize) {
  var row = this.get('row');
  var col = this.get('col');

  return row >= 0
    && row < gsize
    && col >= 0
    && col < gsize;
};

/* Return liberties array within context (stones near and goban size) */

Stone.prototype.liberties = function (stones, gsize, liberties) {
  if (!(stones instanceof Stone.Collection)) stones = new Stone.Collection(stones);
  liberties = liberties || new Stone.Collection();

  var that = this;
  var slots = {
    top: this.topStone(),
    right: this.rightStone(),
    bottom: this.bottomStone(),
    left: this.leftStone()
  };

  function checkLiberty(name, val, slot) {
    if (that.get(name) !== val && !stones.hasPos(slot)) {
      liberties.add(slot);
    } else {
      liberties.remove(slot);
    }
  }

  checkLiberty('row', 0, slots.top);
  checkLiberty('col', gsize - 1, slots.right);
  checkLiberty('row', gsize - 1, slots.bottom);
  checkLiberty('col', 0, slots.left);

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


/* Store a stone into the index */

Stone.Collection.prototype.feedIndex = function (stone) {
  if (_.isArray(stone)) return _.each(stone, this.feedIndex, this);
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  
  this.index = this.index || new Array(MAX_GOBAN_SIZE * MAX_GOBAN_SIZE);
  this.index[MAX_GOBAN_SIZE * stone.get('row') + stone.get('col')] = stone;
};

/* Set the stone slot to null into index */

Stone.Collection.prototype.freeIndexSlot = function (stone) {
  if (_.isArray(stone)) return _.each(stone, this.freeIndexSlot, this);
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  
  this.index = this.index || new Array(MAX_GOBAN_SIZE * MAX_GOBAN_SIZE);
  this.index[MAX_GOBAN_SIZE * stone.get('row') + stone.get('col')] = null;
};

/* Reset the index */

Stone.Collection.prototype.reset = function (stones) {
  Mei.Collection.prototype.reset.apply(this, [stones]);
  this.index = new Array(MAX_GOBAN_SIZE * MAX_GOBAN_SIZE);
  _.each(stones, this.feedIndex, this);
};

/* Search a stone into the index */

Stone.Collection.prototype.getIndexed = function (stone) {
  if (!this.index) return null;
  if (!(stone instanceof Stone)) stone = new Stone(stone);
  return this.index[MAX_GOBAN_SIZE * stone.get('row') + stone.get('col')];
};

/* Return true if stone is indexed */

Stone.Collection.prototype.has = function (stone) {
  var indexed = this.getIndexed(stone);

  return !!indexed && indexed.get('color') === stone.get('color');
};

/* Search a stone position into the index */

Stone.Collection.prototype.hasPos = function (stone) {
  return !!this.getIndexed(stone);
};

/* Add stone(s) only if not included yet */

Stone.Collection.prototype.add = function (stone) {
  if (_.isArray(stone)) return _.each(stone, this.add, this);
  if (!this.hasPos(stone)) {
    Mei.Collection.prototype.add.apply(this, [stone]);
    this.feedIndex(stone);
  }
};

/* Make sure to remove index entry too */

Stone.Collection.prototype.remove = function (stone) {
  if (_.isArray(stone)) return _.each(stone, this.remove, this);
  if (this.hasPos(stone)) this.remove(stone);

  this.freeIndexSlot(stone);
};


/*
 * Static helpers
 */

/* Concat n collections on a new one */

Stone.Collection.union = function () {
  var result = new Stone.Collection();

  _.toArray(arguments).forEach(function (collection) {
    if (! (collection instanceof Stone.Collection)) collection = new Stone.Collection(collection);

    result.add(collection.models);
  });

  return result;
};