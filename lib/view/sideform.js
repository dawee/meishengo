'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var nickformTemplate = require('../template/nickform.jade');
var Mei = require('./mei');


/*
 * SideForm
 */

var SideForm = module.exports = Mei.View.extend();

SideForm.prototype.className = 'mei-side-form';
SideForm.prototype.events = {
  'click .mei-form-nickname .submit': 'submitNickname' 
}

SideForm.prototype.initialize = function () {
  _.bindAll(this, 'submitNickname');
};

SideForm.prototype.openWithNicknameForm = function () {
  this.$nickform.show();  
  this.$el.removeClass('closed');
};

SideForm.prototype.submitNickname = function () {
  this.$el.addClass('closed');
  this.$nickform.hide();
  this.trigger('closed');
  this.trigger('nickname:submit', {nickname: this.$nickname.val()});
};

SideForm.prototype.render = function () {
  this.$nickform = $(nickformTemplate());
  this.$nickname = $('input', this.$nickform);

  this.$el.append(this.$nickform);
  this.$el.addClass('closed');
  this.$nickform.hide();
  return this;
};