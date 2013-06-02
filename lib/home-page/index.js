/*global window*/
/*jslint nomen: true*/
"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    TopMenu = require('top-menu');

function HomePage() {
    _.bindAll(this);
}

HomePage.prototype.open = function () {
    $('header').html(new TopMenu(null, true).render().$el);
    $('footer').empty();
};

module.exports = HomePage;