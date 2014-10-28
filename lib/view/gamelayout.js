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
  _.bindAll(this, 'onSideFormClosed', 'openToContent', 'showNicknameForm');
  this.model = opts.model;
  this.sideForm = new SideForm();
  this.sideForm.forward(this, 'form');
  this.sideForm.on('closed', this.onSideFormClosed);
};

GameLayout.prototype.openToContent = function () {
  this.$content = new GameContent({model: this.model});
  $('.mei-content', this.$el).append(this.$content.render().el);

  this.$content.resize();
  $(window).on('resize', this.$content.resize);

  this.$sandwich.removeClass('closed');
};

GameLayout.prototype.onSideFormClosed = function () {
  this.$sandwich.removeClass('pushed');
};

GameLayout.prototype.showNicknameForm = function (opts) {
  this.sideForm.openWithNicknameForm(opts);
  this.$sandwich.addClass('pushed');
};

GameLayout.prototype.showJoinForm = function (opts) {
  this.sideForm.openWithJoinForm(opts);
  this.$sandwich.addClass('pushed');
};

/* Append sub layers */

GameLayout.prototype.render = function () {

  this.$el.append(template({
    game: this.model.toJSON()
  }));
  this.$el.append(this.sideForm.render().el);

  this.$sandwich = $('.mei-layout-sandwich', this.$el);
  this.$header = $('.mei-header', this.$el);
  this.$footer = $('.mei-footer', this.$el);

  if (this.model.has('id')) {
    _.defer(this.openToContent);
  }

  return this;
};
