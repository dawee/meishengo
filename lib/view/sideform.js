'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var joinformTemplate = require('../template/joinform.jade');
var nickformTemplate = require('../template/nickform.jade');
var playerDepot = require('depot/depot')('mei.player');
var Mei = require('./mei');


/*
 * SideForm
 */

var SideForm = module.exports = Mei.View.extend();

SideForm.prototype.className = 'mei-side-form';
SideForm.prototype.events = {
  'click .mei-form-nickname .submit': 'submitNickname',
  'click .mei-form-join .mei-option': 'joinGame'
};

SideForm.prototype.initialize = function () {
  _.bindAll(this, 'joinGame', 'readToken', 'submitNickname');

  this.on('token:request', this.readToken);
};

SideForm.prototype.openWithTemplate = function (template, opts) {
  this.$form = $(template(opts || {}));

  this.$el
    .empty()
    .append(this.$form);

  this.el.classList.remove('closed');
  this.delegateEvents();
};

SideForm.prototype.readToken = function () {
  var players = playerDepot.all();
  var player = !!players ? players[0] : null;

  if (!player) this.openWithNicknameForm();
  if (player.nickname && !player.token) {
    this.trigger('nickname:submit', {nickname: player.nickname});
  }
};

SideForm.prototype.openWithNicknameForm = function (opts) {
  this.openWithTemplate(nickformTemplate, opts);
};

SideForm.prototype.openWithJoinForm = function (opts) {
  this.openWithTemplate(joinformTemplate, opts);
};

SideForm.prototype.joinGame = function (evt) {
  this.trigger('join', {choice: $(evt.currentTarget).attr('mei-value')});
  this.close();
};

SideForm.prototype.close = function () {
  this.el.classList.add('closed');
  this.trigger('closed');
};

SideForm.prototype.submitNickname = function () {
  var $nickname = $('input', this.$form);

  this.close();
  this.trigger('nickname:submit', {nickname: $nickname.val()});
};

SideForm.prototype.render = function () {
  this.el.classList.add('closed');
  return this;
};