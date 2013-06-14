'use strict';

var _ = require('underscore');
var $ = require('jquery');
var template = require('./template');
var page = require('page');
var NotificationMenu = require('notification-menu');

function TopMenu(currentPage, animated) {
  _.bindAll(this);
  this.currentPage = currentPage || null;
  this.animationDuration = !animated ? 0 : 500;
}

TopMenu.prototype.enlightCurrent = function () {
  if ($.contains(window.document.documentElement, this.$el[0])) {
    $(this.$pages[this.enlightIndex]).animate({opacity: 1}, {
      duration: this.animationDuration,
      done: this.onEnlightDone
    });
  } else {
    _.delay(this.enlightCurrent, 100);
  }
};

TopMenu.prototype.onEnlightDone = function () {
  this.enlightIndex -= 1;

  if (this.enlightIndex >= 0) {
    this.enlightCurrent();
  }
};

TopMenu.prototype.wrapLinks = function () {
  _.each($('a', this.$el), function (link) {
    var $link = $(link);
    $link.click(function (event) {
      event.stopPropagation();
      page($link.attr('href'));
    });
  });
};

TopMenu.prototype.remove = function () {
  this.notificationMenu.remove();
  this.$el.remove();
};

TopMenu.prototype.render = function () {
  this.$el = $(template);
  this.notificationMenu = new NotificationMenu().render();
  this.$el.append(this.notificationMenu.$el);
  this.wrapLinks();

  if (this.currentPage !== null) {
    $('.' + this.currentPage, this.$el).addClass('current');
  }

  this.$pages = $('.page', this.$el);
  this.enlightIndex = this.$pages.length - 1;
  this.enlightCurrent();

  return this;
};

module.exports = TopMenu;
