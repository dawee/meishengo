'use strict';

var _ = require('underscore');
var $ = require('jquery');
var TopMenu = require('top-menu');

function HomePage() {
  _.bindAll(this);
}

HomePage.prototype.open = function () {
  this.topMenu = new TopMenu(null, true).render();
  $('header').html(this.topMenu.$el);
  $('footer').empty();
};

HomePage.prototype.close = function () {
  this.topMenu.remove();
};

module.exports = HomePage;
