'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var joinformTemplate = require('../template/joinform.jade');
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
  this.$forms = {};
};

SideForm.prototype.openWithNicknameForm = function () {
  this.showOnly('nickname');
  this.$el.removeClass('closed');
};

SideForm.prototype.openWithJoinForm = function () {
  this.showOnly('join');
  this.$el.removeClass('closed');
};

SideForm.prototype.submitNickname = function () {
  this.$el.addClass('closed');
  this.trigger('closed');
  this.trigger('nickname:submit', {nickname: this.$nickname.val()});
};

SideForm.prototype.showOnly = function (name) {
  _.each(this.$forms, function (form, formName) {
    if (formName === name) {
      form.show();
    } else {
      form.hide();
    }
  });
};

SideForm.prototype.render = function () {
  this.$forms.join = $(joinformTemplate());
  this.$forms.nickname = $(nickformTemplate());
  this.$nickname = $('input', this.$forms.nickname);

  this.$el.append.apply(this.$el, _.values(this.$forms));
  this.$el.addClass('closed');
  return this;
};