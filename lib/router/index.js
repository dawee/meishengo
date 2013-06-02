/*global window*/
/*jslint nomen: true*/
"use strict";

var _ = require('underscore'),
    page = require('page'),
    LoginPage = require('login-page'),
    HomePage = require('home-page'),
    PlayersPage = require('players-page');

function Router() {
    _.bindAll(this);
    page('#!/home', this.homePage);
    page('#!/players', this.playersPage);
    page('*', this.loginPage);
}

Router.prototype.loginPage = function () {
    var loginPage = new LoginPage();
    loginPage.open();
};

Router.prototype.homePage = function () {
    var homePage = new HomePage();
    homePage.open();
};

Router.prototype.playersPage = function () {
    var playersPage = new PlayersPage();
    playersPage.open();
};

Router.prototype.start = function () {
    page();
    this.loginPage();
};

module.exports = Router;