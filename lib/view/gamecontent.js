/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var Backbone = require('backbone');
var Goban = require('../model/goban');
var GobanView = require('./goban');


/*
 * GameContentView
 */

var GameContentView = module.exports = Backbone.View.extend();

GameContentView.prototype.tagName = 'mei-content-game';


/* Append the goban */

GameContentView.prototype.initialize = function (opts) {
  _.bindAll(this, 'resize', 'putStone', 'gameUpdated');
  this.model = opts.model;
  this.socket = opts.socket;
  this.socket.emit('game:observe', {id: this.model.get('id')});
  this.socket.on('game:updated', this.gameUpdated)
  this.gobanView = new GobanView({model: this.model.gbn()});
  this.gobanView.on('click', this.putStone);
  
  this.$el.append(this.gobanView.render().el);
};

/* Put a stone on goban */

GameContentView.prototype.putStone = function (opts) {
  if (!this.model.has('color')) return;

  var stone = {
    row: opts.row,
    col: opts.col,
    color: this.model.get('color')
  };

  if (this.model.putStone(stone)) this.socket.emit('stone:put', {stone: stone});
};

GameContentView.prototype.gameUpdated = function (data) {
  this.model.set(data.game);
};

/* Setup goban geometry from current content size */

GameContentView.prototype.resize = function () {
  var contentHeight = this.$el.height();
  var dim = contentHeight * 0.9;
  var margin = (contentHeight - dim) / 2;

  this.gobanView.resize({
    top: margin,
    left: margin,
    width: dim,
    height: dim
  });
};
