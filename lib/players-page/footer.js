'use strict';

var _ = require('underscore');
var $ = require('jquery');
var template = require('./footer-template');

function Footer(options) {
  _.bindAll(this);

  this.onNext = options.next;
  this.onPrevious = options.previous;
}

Footer.prototype.render = function () {
  this.$el = $(template);

  $('.next', this.$el).click(this.onNext);
  $('.previous', this.$el).click(this.onPrevious);

  return this;
};

module.exports = Footer;
