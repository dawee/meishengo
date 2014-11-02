'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var Mei = require('./mei');
var Stone = require('./stone');
var StoneGroup = require('./stonegroup');


/*
 * Goban model
 *
 * @key size (9 / 13 / 19)
 * @key groups
 */

var Goban = module.exports = Mei.Model.extend({
  defaults: {
    size: 19,
    groups: new StoneGroup.Collection()
  },
  schema: {
    size: Number,
    groups: StoneGroup.Collection
  }
});

Goban.prototype.queryStone = function (stone) {
  var found = null;
  if (stone instanceof Stone) stone = stone.toJSON();

  this.get('groups').any(function (group) {
    found = group.get('stones').findWhere(stone);
    return found;
  });

  return found;
};

/* Test if stone can be put */

Goban.prototype.canPutStone = function (stone) {
};

/* Put a stone if possible */

Goban.prototype.putStone = function (stone, done) {
};

/* Shortcut for range based iterations */

Goban.prototype.range = function () {
  return _.range(0, this.get('size'));
};

/* Iterate over all stones present on the goban */

Goban.prototype.eachStone = function (fn, ctx) {
  this.get('groups').each(function (group) {
    group.get('stones').each(fn, ctx);
  }, ctx);
};
