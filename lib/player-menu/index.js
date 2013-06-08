'use strict';

var _ = require('underscore');
var $ = require('jquery');
var template = require('./template');
var InlineSelector = require('inline-selector');

function PlayerMenu(player) {
  _.bindAll(this);
  this.player = player;
}

PlayerMenu.prototype.render = function () {
  this.$el = $(template);
  this.boardSelector = new InlineSelector(['19x19', '13x13', '9x9']).render();
  this.boardSelector.$el.insertBefore($('.button', this.$el));
  $('.login', this.$el).html(this.player.login);
  return this;
};

PlayerMenu.removeAll = function () {
  $('.player-menu').remove();
};

module.exports = PlayerMenu;