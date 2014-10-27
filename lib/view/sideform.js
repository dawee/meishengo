'use strict';

/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var template = require('../template/nickform.jade');
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

SideForm.prototype.open = function () {
  this.$el.removeClass('closed');
};

SideForm.prototype.submitNickname = function () {
  this.$el.addClass('closed');  
  this.trigger('closed');
};

SideForm.prototype.render = function () {
  this.$el.addClass('closed');
  this.$el.append(template());
  return this;
};