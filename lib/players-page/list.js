/*global window*/
/*jslint nomen: true*/
"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    template = require('./list-template'),
    proxyClient = require('proxy-client'),
    PlayerTag = require('player-tag');

function PlayersList() {
    _.bindAll(this);
    this.proxyClient = proxyClient.getInstance('pandanet');
}

PlayersList.prototype.render = function () {
    this.$el = $(template);
    this.proxyClient.emit('players:list:request');
    this.proxyClient.once('players:list:success', this.onPlayersListSuccess);
    return this;
};

PlayersList.prototype.onPlayersListSuccess = function (data) {
    var areaNames = ['.players-area-top', '.players-area-right', '.players-area-bottom'],
        areaIndex = 0,
        $area = $(areaNames[areaIndex], this.$el);
    _.each(data.players, function (player) {
        var playerTag = new PlayerTag(player);
        if (areaIndex < areaNames.length) {
            $area.append(playerTag.render().$el);
            if (playerTag.$el.position().top + playerTag.$el.height() > $area.height()) {
                playerTag.$el.remove();
                areaIndex += 1;
                if (areaIndex < areaNames.length) {
                    $area = $(areaNames[areaIndex], this.$el);
                }
            }
        }
    }, this);
};

module.exports = PlayersList;