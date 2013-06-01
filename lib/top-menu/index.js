var _ = require('underscore'),
    $ = require('jquery'),
    template = require('./template');

function TopMenu(currentPage) {
    _.bindAll(this);
    this.currentPage = currentPage || null;
}

TopMenu.prototype.enlightCurrent = function () {
    if ($.contains(document.documentElement, this.$el[0])) {
        $(this.$pages[this.enlightIndex]).animate({opacity: 1}, {duration: 1000, done: this.onEnlightDone});
    } else {
        _.delay(this.enlightCurrent, 100);
    }
};

TopMenu.prototype.onEnlightDone = function () {
    this.enlightIndex -= 1;
    if (this.enlightIndex >= 0) {
        this.enlightCurrent();
    }
};

TopMenu.prototype.render = function() {
    this.$el = $(template);
    if (this.currentPage !== null) {
        $('.' + this.currentPage, this.$el).addClass('current');
    }
    this.$pages = $('.page', this.$el);
    this.enlightIndex = this.$pages.length - 1;
    this.enlightCurrent();
    return this;
};

module.exports = TopMenu;