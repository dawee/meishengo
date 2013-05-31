var _ = require('underscore'),
    $ = require('jquery');

function LoginPage() {
    _.bindAll(this);
}

LoginPage.prototype.open = function () {
    $('#content').append(
        $('<div></div>')
            .addClass('title')
            .append(
                $('<h1></h1>').html('meishengo')
            ),
        $('<div></div>').addClass('goban-bg')
    );
};

module.exports = LoginPage;