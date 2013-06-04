/*global window*/
/*jslint nomen: true*/
"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    TopMenu = require('top-menu'),
    PlayersList = require('./list'),
    Footer = require('./footer');

function PlayersPage() {
    _.bindAll(this);
    this.pageIndex = 0;
}

PlayersPage.prototype.onListVisible = function () {
    $('footer').html(new Footer({
        next: this.onNext,
        previous: this.onPrevious
    }).render().$el);
};

PlayersPage.prototype.open = function () {
    $('header').html(new TopMenu('players').render().$el);
    this.playersList = new PlayersList({visible: this.onListVisible}).render();
    $('#content').html(this.playersList.$el);
};

PlayersPage.prototype.onNext = function () {
    var pageIndex = this.pageIndex + 1;
    if (this.playersList.openPage(pageIndex)) {
        this.pageIndex = pageIndex;
    }
};

PlayersPage.prototype.onPrevious = function () {
    var pageIndex = this.pageIndex - 1;
    if (this.playersList.openPage(pageIndex)) {
        this.pageIndex = pageIndex;
    }
};

module.exports = PlayersPage;