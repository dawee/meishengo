'use strict';

var _ = require('underscore');
var $ = require('jquery');
var template = require('./template');

function PlayerMenu(player) {
  _.bindAll(this);
  this.player = player;
}

PlayerMenu.prototype.render = function() {
  this.$el = $(template);
  $('.login', this.$el).html(this.player.login);
  return this;
};

PlayerMenu.removeAll = function () {
  $('.player-menu').remove();
};

module.exports = PlayerMenu;