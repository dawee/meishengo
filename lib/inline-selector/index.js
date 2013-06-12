'use strict';

var _ = require('underscore');
var $ = require('jquery');
var template = require('./template');

function InlineSelector(choices) {
  _.bindAll(this);

  this.choices = choices;
  this.index = 0;
}

InlineSelector.prototype.calcWidth = function () {
  var maxLength = 0;

  _.each(_.keys(this.choices), function (choice) {
    if (choice.length > maxLength) {
      maxLength = choice.length;
    }
  });

  this.$el.css('width', (2 + maxLength * 2 / 3) + 'em');
};

InlineSelector.prototype.update = function () {
  $('.text', this.$el).html(_.keys(this.choices)[this.index]);
};

InlineSelector.prototype.val = function () {
  return this.choices[_.keys(this.choices)[this.index]];
};

InlineSelector.prototype.onClickPrevious = function () {
  this.index -= 1;

  if (this.index < 0) {
    this.index = this.choices.length - 1;
  }

  this.update();
};

InlineSelector.prototype.onClickNext = function () {
  this.index += 1;

  if (this.index >= this.choices.length) {
    this.index = 0;
  }

  this.update();
};

InlineSelector.prototype.render = function () {
  this.$el = $(template);

  $('.previous', this.$el).click(this.onClickPrevious);
  $('.next', this.$el).click(this.onClickNext);
  this.calcWidth();
  this.update();
  return this;
};

module.exports = InlineSelector;