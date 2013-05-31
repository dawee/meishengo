var _ = require('underscore'),
    page = require('page'),
    LoginPage = require('login-page');

function Router () {
    _.bindAll(this);
    page('*', this.loginPage);
}

Router.prototype.loginPage = function () {
    var loginPage = new LoginPage();
    loginPage.open();
};

Router.prototype.start = function () {
    page();
};

module.exports = Router;