'use strict';

var _ = require('underscore');
var $ = require('jquery');
var template = require('./template');
var proxyClient = require('proxy-client');
var notifications = [];

function NotificationMenu() {
  _.bindAll(this);
  this.client = proxyClient.getInstance('pandanet');
  this.client.on('match:request', this.onMatchRequest);
}

NotificationMenu.prototype.update = function () {
  this.$el.html(notifications.length);
  if (notifications.length > 0) {
    this.$el.addClass('has-new');
  } else {
    this.$el.removeClass('has-new');
  }
};

NotificationMenu.prototype.onMatchRequest = function (data) {
  notifications.push({type: 'match:request', data: data});
  this.update();
};

NotificationMenu.prototype.remove = function () {
  this.$el.remove();
  this.client.removeListener('match:request', this.onMatchRequest);
};

NotificationMenu.prototype.render = function () {
  this.$el = $(template);
  this.update();
  return this;
};

module.exports = NotificationMenu;