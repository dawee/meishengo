'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var template = require("../template/gamelayout.jade");
var Mei = require('./mei');
var GameContent = require('./gamecontent');


/*
 * GameLayout
 */

var GameLayout = module.exports = Mei.View.extend();

GameLayout.prototype.className = 'mei-game-layout';

GameLayout.prototype.initialize = function (opts) {
  _.bindAll(this, 'openToContent');
  this.model = opts.model;
};

GameLayout.prototype.openToContent = function () {
  this.$content = new GameContent({model: this.model});
  $('.mei-content', this.$el).append(this.$content.render().el);

  this.$content.resize();
  $(window).on('resize', this.$content.resize);

  $('.mei-layout-sandwich', this.$el).removeClass('closed');
};

/* Append sub layers */

GameLayout.prototype.render = function () {
  this.$el.append(template({
    game: this.model.toJSON()
  }));

  if (this.model.has('id')) {
    _.defer(this.openToContent);
  }

  return this;
};
