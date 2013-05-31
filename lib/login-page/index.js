var _ = require('underscore'),
    $ = require('jquery'),
    LoginForm = require('./form'),
    footerTemplate = require('./footer-template'),
    contentTemplate = require('./content-template');

function LoginPage() {
    _.bindAll(this);
}

LoginPage.prototype.open = function () {
    $('#content').html(contentTemplate);
    $('footer').html(footerTemplate);
    $('header').html(new LoginForm().render().$el);
};

module.exports = LoginPage;