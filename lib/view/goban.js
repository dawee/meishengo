'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var MeiGoban = require('mei-goban');
var Mei = require('./mei');
var Stone = require('../model/stone');


/*
 * Goban View
 *
 * .mei-goban
 */

var GobanView = module.exports = Mei.View.extend();

GobanView.prototype.className = 'mei-goban';

/* Initialize basic template */

GobanView.prototype.initialize = function (opts) {
  _.bindAll(this, 'render');
  this.currentStones = new Stone.Collection();
  this.meiGoban = new MeiGoban({size: this.model.get('size')});
  this.meiGoban.on('mousedown', _.bind(function (data) {
    this.trigger('intersection:click', data);
  }, this));
  this.model.on('change', this.render);
  this.$el.append(this.meiGoban.el);

  if (!!opts.geom) this.resize(opts.geom);
};

/* Resize the goban in px with the given geom */

GobanView.prototype.resize = function (geom) {
  this.$el.css(geom);
  this.meiGoban.set('width', parseInt(geom.width, 10));
};

/* Call render of all impacted intersections */

GobanView.prototype.render = function () {
  var stones = {};
  var newStones = new Stone.Collection();

  this.model.eachStone(function (stone) {
    this.meiGoban.putStone(stone.get('row'), stone.get('col'), stone.get('color'));
    newStones.add(stone);
    this.currentStones.remove(stone);
    this.currentStones.remove(stone.oppositeStone());
  }, this);

  this.currentStones.each(function (stone) {
    this.meiGoban.removeStone(stone.get('row'), stone.get('col'));
  }, this);

  this.currentStones = newStones;

  return this;
};