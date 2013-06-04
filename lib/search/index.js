/*global window*/
/*jslint nomen: true*/
"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    template = require('./template');

function Search(options) {
    _.bindAll(this);
    this.callback = options.change;
}

Search.prototype.render = function () {
    this.$el = $(template);
    this.$text = $('.text', this.$el);
    this.$text.keyup(this.onTextChange);
    return this;
};

Search.prototype.onTextChange = function (event) {
    var text = $('.text', this.$el).val();
    if (text.length > 1) {
        this.callback(text);
    }
};

module.exports = Search;