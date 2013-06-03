/*global window*/
/*jslint nomen: true*/
"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    template = require('./template');

function PlayerTag(player) {
    _.bindAll(this);
    this.player = player;
}

PlayerTag.prototype.render = function () {
    this.$el = $(template);
    $('.name', this.$el).html(this.player.login);
    $('.rank', this.$el).html(this.player.rank);
    return this;
};

module.exports = PlayerTag;