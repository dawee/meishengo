'use strict';

var _ = require('underscore');
var page = require('page');
var LoginPage = require('login-page');
var HomePage = require('home-page');
var PlayersPage = require('players-page');
var noop = function () {};

function Router() {
  _.bindAll(this);
  page('#!/home', this.homePage);
  page('#!/players', this.playersPage);
  page('#!/games', noop);
  page('#!/profile', noop);
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
