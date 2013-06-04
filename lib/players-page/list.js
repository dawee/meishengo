/*global window*/
/*jslint nomen: true*/
"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    template = require('./list-template'),
    proxyClient = require('proxy-client'),
    PlayerTag = require('player-tag'),
    loader = require('loader');

function PlayersList(options) {
    _.bindAll(this);
    this.proxyClient = proxyClient.getInstance('pandanet');
    this.onVisible = options.visible;
    this.areaNames = ['.players-area-top', '.players-area-right', '.players-area-bottom'];
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
        column[index].$el.animate({opacity: 1}, {duration: 600});
    }
    _.delay(this.nextColumn, 20);
};

PlayersList.prototype.nextColumn = function () {
    this.columnSlot += 1;
    if (this.columnSlot < _.size(this.columns)) {
        this.enlightColumn();
    }
};

PlayersList.prototype.addPlayerTag = function (player, index) {
    var playerTag = new PlayerTag(player),
        columnIndex;
    if (this.areaIndex < this.areaNames.length) {
        this.$area.append(playerTag.render().$el);
        if (playerTag.$el.position().top + playerTag.$el.height() > this.$area.height()) {
            playerTag.$el.remove();
            this.areaIndex += 1;
            if (this.areaIndex < this.areaNames.length) {
                this.$area = $(this.areaNames[this.areaIndex], this.$el);
            } else if (!this.playersCountByPage) {
                this.playersCountByPage = index;
            }
        } else {
            columnIndex = 'col' + $('.name', playerTag.$el).offset().left;
            if (!_.has(this.columns, columnIndex)) {
                this.columns[columnIndex] = [];
            }
            this.columns[columnIndex].push(playerTag);
        }
    }
};

PlayersList.prototype.onPlayersListSuccess = function (data) {
    loader.stop();
    this.rawPlayersList = data.players;
    this.openPage(0);
};

PlayersList.prototype.addPlayers = function () {
    $('.players-area', this.$el).empty();
    _.each(this.players, this.addPlayerTag, this);
    this.enlightColumn();
    this.onVisible();
};

PlayersList.prototype.openPage = function (pageIndex) {
    var status = false;
    if (!this.playersCountByPage || (pageIndex >= 0 && pageIndex * this.playersCountByPage < this.rawPlayersList.length)) {
        this.areaIndex = 0;
        this.$area = $(this.areaNames[this.areaIndex], this.$el);
        this.columns = {};
        this.columnSlot = 0;
        if (!this.playersCountByPage) {
            this.players = this.rawPlayersList;
        } else {
            this.players = this.rawPlayersList.slice(
                pageIndex * this.playersCountByPage,
                (pageIndex + 1) * this.playersCountByPage - 1
            );
        }
        this.addPlayers();
        status = true;
    }
    return status;
};

module.exports = PlayersList;