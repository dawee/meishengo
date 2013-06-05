'use strict';

var _ = require('underscore');
var $ = require('jquery');
var template = require('./template');
var local = {};

local.callback = function () {};

function PlayerTag(player) {
  _.bindAll(this);
  this.player = player;
}

PlayerTag.prototype.render = function () {
  this.$el = $(template);
  $('.name', this.$el).html(this.player.login);
  $('.rank', this.$el).html(this.player.rank);
  this.$el.click(this.onClick);
  return this;
};

PlayerTag.prototype.onClick = function() {
  local.callback(this.player);
};

PlayerTag.onSelectPlayer = function (callback) {
  local.callback = callback;
};

module.exports = PlayerTag;
