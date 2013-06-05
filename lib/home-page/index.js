'use strict';

var _ = require('underscore');
var $ = require('jquery');
var TopMenu = require('top-menu');

function HomePage() {
  _.bindAll(this);
}

HomePage.prototype.open = function () {
  $('header').html(new TopMenu(null, true).render().$el);
  $('footer').empty();
};

module.exports = HomePage;
