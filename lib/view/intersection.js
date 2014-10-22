'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var Backbone = require('backbone');

/*
 * Intersection View
 *
 * <mei-intersection> // main wrapper  
 *    <mei-horizontal-line>
 *    <mei-vertical-line>
 *    <mei-hoshi> // only if hoshi
 */

var IntersectionView = module.exports = Backbone.View.extend();

IntersectionView.prototype.className = 'mei-intersection';
IntersectionView.prototype.events = {
  mousedown: 'click'
};


/* Initialize basic template */

IntersectionView.prototype.initialize = function (opts) {
  _.bindAll(this, 'render', 'click');

  this.model = new Backbone.Model();
  this.model.on('change', this.render);
  this.row = opts.row;
  this.col = opts.col;
  this.gsize = opts.gsize;
  this.$el
    .append($('<div>').addClass('mei-vertical-line').addClass('draw'))
    .append($('<div>').addClass('mei-horizontal-line').addClass('draw'));

  if (this.row === 0) this.$el.addClass('top');
  if (this.row === this.gsize - 1) this.$el.addClass('bottom');
  if (this.col === 0) this.$el.addClass('left');
  if (this.col === this.gsize - 1) this.$el.addClass('right');
  if (this.isHoshi()) this.$el.append($('<div>').addClass('mei-hoshi').addClass('draw'));

  this.$stone = $('<div>').addClass('mei-stone')
    .append($('<span>').addClass('shadow'))
    .append($('<span>').addClass('light'));
  this.$el.append(this.$stone);
};

/* Return if current intersection should be an hoshi  */

IntersectionView.prototype.isHoshi = function () {
  var gap = this.gsize > 9 ? 4 : 3;
  var isGapFromColWall = (this.col === gap - 1) || (this.gsize - this.col === gap);
  var isGapFromRowWall = (this.row === gap - 1) || (this.gsize - this.row === gap);
  var isRowCentered = (this.row === (this.gsize - 1) / 2) && this.gsize > 9;
  var isColCentered = (this.col === (this.gsize - 1) / 2) && this.gsize > 9;
  var isWallHoshi = (isGapFromRowWall || isGapFromColWall) && (isColCentered || isRowCentered);
  var isCornerHoshi = isGapFromColWall && isGapFromRowWall;
  var isCenterHoshi = isRowCentered && isColCentered;
  return isCornerHoshi || isWallHoshi || isCenterHoshi;
};

/* Handler for click forwarding */

IntersectionView.prototype.click = function () {
  this.trigger('click', this);
};

/* Render stone and markup */

IntersectionView.prototype.render = function () {
  var stoneColor = this.model.get('color');

  this.$stone
    .removeClass('black')
    .removeClass('white');

  if (stoneColor) this.$stone.addClass(stoneColor);
  if (this.model.get('latest')) {
    this.$stone.addClass('latest');
  } else {
    this.$stone.removeClass('latest');
  }
  return this;
};