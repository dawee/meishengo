'use strict';

var _ = require('underscore');
var page = require('page');
var LoginPage = require('login-page');
var HomePage = require('home-page');
var PlayersPage = require('players-page');
var noop = function () {};

function Router() {
  _.bindAll(this);
  this.lastPage = null;

  page('#!/home', this.homePage);
  page('#!/players', this.playersPage);
  page('#!/games', noop);
  page('#!/profile', noop);
  page('*', this.loginPage);
}

Router.prototype.renderPage = function (PageType) {
  var page = new PageType();

  if (this.lastPage && _.isFunction(this.lastPage.close)) {
    this.lastPage.close();
  }

  page.open();
  this.lastPage = page;
};

Router.prototype.loginPage = function () {
  this.renderPage(LoginPage);
};

Router.prototype.homePage = function () {
  this.renderPage(HomePage);
};

Router.prototype.playersPage = function () {
  this.renderPage(PlayersPage);
};

Router.prototype.start = function () {
  page();
  this.loginPage();
};

module.exports = Router;
