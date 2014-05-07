/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var IntersectionView = require('./intersection');

/*
 * Goban View
 *
 * <mei-goban> // main wrapper  
 *    <mei-board> 
 *      <mei-intersections>
 *        <mei-row> // from 0 to goban size
 *          <mei-intersection> // from 0 to goban size
 */

var GobanView = module.exports = Backbone.View.extend();

GobanView.prototype.tagName = 'mei-goban';

/* Initialize basic template */

GobanView.prototype.initialize = function (opts) {
  if (!!opts.geom) this.resize(opts.geom);

  this.intersections = {};
  this.$el
    .addClass('size-' + this.model.get('size'))
    .append(this.createBoard())
    .append($('<mei-board-top-edge>'))
    .append($('<mei-board-right-edge>'))
    .append($('<mei-board-bottom-edge>'))
    .append($('<mei-board-left-edge>'));
};

/* Create the board : where background is visible */

GobanView.prototype.createBoard = function () {
  return $('<mei-board>').append(this.createIntersections());
};

/* Create the intersections wrapper */

GobanView.prototype.createIntersections = function () {
  return $('<mei-intersections>').append(
    _.map(this.model.range(), this.createRow, this)
  );
};

/* Create a row with all its intersections views */

GobanView.prototype.createRow = function (row) {
  this.intersections[row] = {};

  return $('<mei-row>').append(
    _.map(this.model.range(), function (col) {
      this.intersections[row][col] = new IntersectionView({
        row: row,
        col: col,
        gsize: this.model.get('size')
      });
      
      return this.intersections[row][col].el;
    }, this)
  )[0];
};

/* Resize the goban in px with the given geom */

GobanView.prototype.resize = function (geom) {
  this.$el
    .css('top', geom.top)
    .css('left', geom.left)
    .css('width', geom.width)
    .css('height', geom.height);
};