'use strict';

var _ = require('underscore');
var $ = require('jquery');
var LoginForm = require('login-form');
var footerTemplate = require('./footer-template');
var contentTemplate = require('./content-template');

function LoginPage() {
  _.bindAll(this);
}

LoginPage.prototype.open = function () {
  $('#content').html(contentTemplate);
  $('footer').html(footerTemplate);
  $('header').html(new LoginForm().render().$el);
};

module.exports = LoginPage;
