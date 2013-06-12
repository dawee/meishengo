'use strict';

var _ = require('underscore');
var $ = require('jquery');
var template = require('./template');
var InlineSelector = require('inline-selector');
var client = require('proxy-client');

function PlayerMenu(player) {
  _.bindAll(this);
  this.player = player;
  this.client = client.getInstance('pandanet');
}

PlayerMenu.prototype.render = function () {
  this.$el = $(template);
  this.$button = $('.button', this.$el);
  this.boardSelector = new InlineSelector({'19x19': 19, '13x13': 13, '9x9': 9}).render();
  this.boardSelector.$el.insertBefore(this.$button);
  $('.login', this.$el).html(this.player.login);
  this.$button.click(this.onClickRequest);
  return this;
};

PlayerMenu.prototype.onClickRequest = function () {
  this.client.emit('match:request', {
    opponent: this.player.login,
    size: this.boardSelector.val(),
    time: 0,
    byoyomi: 0,
    color: 'black'
  });
};

PlayerMenu.removeAll = function () {
  $('.player-menu').remove();
};

module.exports = PlayerMenu;