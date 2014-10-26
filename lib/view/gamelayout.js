'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var async = require('async');
var template = require("../template/gamelayout.jade");
var Mei = require('./mei');
var GameContent = require('./gamecontent');
var SideForm = require('./sideform');


/*
 * GameLayout
 */

var GameLayout = module.exports = Mei.View.extend();

GameLayout.prototype.className = 'mei-game-layout';

GameLayout.prototype.initialize = function (opts) {
  _.bindAll(this, 'openToContent', 'showJoiningForm');
  this.model = opts.model;
};

GameLayout.prototype.openToContent = function () {
  this.$content = new GameContent({model: this.model});
  $('.mei-content', this.$el).append(this.$content.render().el);

  this.$content.resize();
  $(window).on('resize', this.$content.resize);

  this.$sandwich.removeClass('closed');
};

GameLayout.prototype.showJoiningForm = function () {
  this.$sandwich.addClass('pushed');
};

/* Append sub layers */

GameLayout.prototype.render = function () {
  this.sideForm = new SideForm();

  this.$el.append(this.sideForm.render().el);
  this.$el.append(template({
    game: this.model.toJSON()
  }));

  this.$sandwich = $('.mei-layout-sandwich', this.$el);
  this.$header = $('.mei-header', this.$el);
  this.$footer = $('.mei-footer', this.$el);

  if (this.model.has('id')) {
    _.defer(this.openToContent);
  }

  return this;
};
