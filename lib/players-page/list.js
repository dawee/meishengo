/*global window*/
/*jslint nomen: true*/
"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    template = require('./list-template'),
    proxyClient = require('proxy-client'),
    PlayerTag = require('player-tag'),
    loader = require('loader');

function PlayersList() {
    _.bindAll(this);
    this.proxyClient = proxyClient.getInstance('pandanet');
    this.columns = {};
    this.columnSlot = 0;
}

PlayersList.prototype.render = function () {
    this.$el = $(template);
    loader.start();
    this.proxyClient.emit('players:list:request');
    this.proxyClient.once('players:list:success', this.onPlayersListSuccess);
    return this;
};

PlayersList.prototype.enlightColumn = function () {
    var index = 0,
        columnIndex = _.keys(this.columns)[this.columnSlot],
        column = this.columns[columnIndex];
    for (index = 0; index < column.length; index += 1) {
        column[index].$el.animate({opacity: 1}, {duration: 1000});
    }
    _.delay(this.nextColumn, 50);
};

PlayersList.prototype.nextColumn = function () {
    this.columnSlot += 1;
    if (this.columnSlot < _.size(this.columns)) {
        this.enlightColumn();
    }
};

PlayersList.prototype.onPlayersListSuccess = function (data) {
    loader.stop();
    var areaNames = ['.players-area-top', '.players-area-right', '.players-area-bottom'],
        areaIndex = 0,
        $area = $(areaNames[areaIndex], this.$el);
    _.each(data.players, function (player) {
        var playerTag = new PlayerTag(player),
            columnIndex;
        if (areaIndex < areaNames.length) {
            $area.append(playerTag.render().$el);
            if (playerTag.$el.position().top + playerTag.$el.height() > $area.height()) {
                playerTag.$el.remove();
                areaIndex += 1;
                if (areaIndex < areaNames.length) {
                    $area = $(areaNames[areaIndex], this.$el);
                }
            } else {
                columnIndex = 'col' + $('.name', playerTag.$el).offset().left;
                if (!_.has(this.columns, columnIndex)) {
                    this.columns[columnIndex] = [];
                }
                this.columns[columnIndex].push(playerTag);
            }
        }
    }, this);
    this.enlightColumn();
};

module.exports = PlayersList;