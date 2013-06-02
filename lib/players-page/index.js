/*global window*/
/*jslint nomen: true*/
"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    TopMenu = require('top-menu'),
    PlayersList = require('./list');

function PlayersPage() {
    _.bindAll(this);
}

PlayersPage.prototype.open = function () {
    $('header').html(new TopMenu('players').render().$el);
    $('#content').html(new PlayersList().render().$el);
};

module.exports = PlayersPage;