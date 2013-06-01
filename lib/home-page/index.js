var _ = require('underscore'),
    $ = require('jquery'),
    TopMenu = require('top-menu');

function HomePage() {
    _.bindAll(this);
}

HomePage.prototype.open = function() {
    $('header').html(new TopMenu().render().$el);
    $('footer').empty();
};

module.exports = HomePage;