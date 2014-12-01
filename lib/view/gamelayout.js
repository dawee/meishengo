'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
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
  this.content = new GameContent({model: this.model});
  $('.mei-content', this.$el).append(this.content.render().el);

  this.content.forward(this);
  this.content.resize();
  $(window).on('resize', this.content.resize);

  this.sandwich.classList.remove('closed');
};

GameLayout.prototype.unlockChat = function () {
  this.content.unlockChat();
};

GameLayout.prototype.echoMessage = function (message) {
  this.content.echoMessage(message);
};

GameLayout.prototype.onSideFormClosed = function () {
  this.sandwich.classList.remove('pushed');
};

GameLayout.prototype.showNicknameForm = function (opts) {
  this.sideForm.openWithNicknameForm(opts);
  this.sandwich.classList.add('pushed');
};

GameLayout.prototype.showJoinForm = function (opts) {
  this.sideForm.openWithJoinForm(opts);
  this.sandwich.classList.add('pushed');
};

/* Append sub layers */

GameLayout.prototype.render = function () {

  this.$el.append(template({
    game: this.model.toJSON()
  }));
  this.$el.append(this.sideForm.render().el);

  this.sandwich = $('.mei-layout-sandwich', this.$el)[0];
  this.$header = $('.mei-header', this.$el);
  this.$footer = $('.mei-footer', this.$el);

  if (this.model.has('id')) {
    _.defer(this.openToContent);
  }

  return this;
};
