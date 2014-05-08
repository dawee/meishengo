/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var StoneGroup = require('./stonegroup');
var Transaction = require('./transaction');


/*
 * Private StoneGroupArray collection
 */

var StoneGroupArray = Backbone.Collection.extend({model: StoneGroup});


/*
 * Goban model
 *
 * @key size (9 / 13 / 19)
 * @key groups
 */

var Goban = module.exports = Backbone.Model.extend({
  defaults: {
    size: 19
  }
});

/* Init the groups with the Group Array collection */

Goban.prototype.initialize = function (opts) {
  opts = opts || {};
  this.set('groups', new StoneGroupArray(opts.groups || []))
};

/* Test if stone can be put with a new transaction */

Goban.prototype.canPutStone = function (stone) {
  var transaction = new Transaction({
    groups: this.get('groups').clone(),
    gsize: this.get('size')
  });

  return transaction.putStone(stone);
};

/* Put a stone if possible */

Goban.prototype.putStone = function (stone) {
  var transaction = new Transaction({
    groups: this.get('groups').clone(),
    gsize: this.get('size')
  });

  if (!transaction.putStone(stone)) return false;

  this.set('groups', transaction.get('groups'));
  return true;
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
