/*global window*/
/*jslint nomen: true*/
"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    template = require('./form-template'),
    page = require('page'),
    proxyClient = require('proxy-client'),
    loader = require('loader');

function LoginForm() {
    _.bindAll(this);
}

LoginForm.prototype.render = function () {
    this.$el = $(template);
    this.$el.submit(this.onConnect);
    return this;
};

LoginForm.prototype.onConnect = function (event) {
    event.preventDefault();
    this.$el.animate({opacity: 0}, {duration: 800});
    loader.start();
    this.login = $('.login', this.$el).val();
    this.password = $('.password', this.$el).val();
    this.proxyClient = proxyClient.createInstance('pandanet');
    this.proxyClient.once('auth:request', this.onAuthRequest);
};

LoginForm.prototype.onAuthRequest = function () {
    this.proxyClient.emit('auth:sending', {login: this.login, password: this.password});
    this.proxyClient.once('auth:success', this.openHomePage);
};

LoginForm.prototype.openHomePage = function () {
    page('#!/home');
};

module.exports = LoginForm;