/*
 * Module dependencies
 */

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
  _.bindAll(this, 'resize');
  this.model = opts.model;
  this.gobanView = new GobanView({model: this.model.gbn()});
  this.$el.append(this.gobanView.render().el);
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
