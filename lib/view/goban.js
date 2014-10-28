'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var Mei = require('./mei');
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

var GobanView = module.exports = Mei.View.extend();

GobanView.prototype.className = 'mei-goban';

/* Initialize basic template */

GobanView.prototype.initialize = function (opts) {
  _.bindAll(this, 'render');
  this.model.on('change', this.render);
  this.intersections = {};
  this.$el
    .addClass('size-' + this.model.get('size'))
    .append(this.createBoard());

  if (!!opts.geom) this.resize(opts.geom);
};

/* Create the board : where background is visible */

GobanView.prototype.createBoard = function () {
  return $('<div>').addClass('mei-board').append(this.createIntersections());
};

/* Create the intersections wrapper */

GobanView.prototype.createIntersections = function () {
  return $('<div>').addClass('mei-intersections').append(
    _.map(this.model.range(), this.createRow, this)
  );
};

/* Create a row with all its intersections views */

GobanView.prototype.createRow = function (row) {
  this.intersections[row] = {};

  return $('<div>').addClass('mei-row').append(
    _.map(this.model.range(), function (col) {
      this.intersections[row][col] = new IntersectionView({
        row: row,
        col: col,
        gsize: this.model.get('size')
      });
      this.intersections[row][col].forward(this, 'intersection');

      return this.intersections[row][col].el;
    }, this)
  )[0];
};

/* Resize the goban in px with the given geom */

GobanView.prototype.resize = function (geom) {
  if (geom.width && geom.width < 300) {
    this.$el.addClass('small');
  } else {
    this.$el.removeClass('small');
  }

  this.$el.css(geom);
};

/* Call render of all impacted intersections */

GobanView.prototype.render = function () {
  var stones = {};

  this.model.eachStone(function (stone) {
    var data = stone.toJSON();

    if (!_.has(stones, data.row)) stones[data.row] = {};
    stones[data.row][data.col] = stone;
  });  

  _.each(this.intersections, function (row) {
    _.each(row, function (itr) {
      if (!_.has(stones, itr.row) || !_.has(stones[itr.row], itr.col)) {
        itr.model.set('color', null);
      } else {
        itr.model.set(stones[itr.row][itr.col].toJSON());
      }
    });
  });

  return this;
};