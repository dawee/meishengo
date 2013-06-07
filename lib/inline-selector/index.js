'use strict';

var _ = require('underscore');
var $ = require('jquery');
var template = require('./template');

function InlineSelector() {
  _.bindAll(this);
}

InlineSelector.prototype.render = function () {
  this.$el = $(template);
  return this;
};

module.exports = InlineSelector;