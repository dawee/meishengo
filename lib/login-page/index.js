var _ = require('underscore'),
    $ = require('jquery'),
    footerTemplate = require('./footer-template'),
    contentTemplate = require('./content-template');

function LoginPage() {
    _.bindAll(this);
}

LoginPage.prototype.open = function () {
    $('#content').html(contentTemplate);
    $('footer').html(footerTemplate);
};

module.exports = LoginPage;