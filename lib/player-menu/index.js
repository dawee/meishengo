var _ = require('underscore'),
    $ = require('jquery'),
    template = require('./template');

function PlayerMenu(player) {
    _.bindAll(this);
    this.player = player;
}

PlayerMenu.prototype.render = function() {
    this.$el = $(template);
    $('.login', this.$el).html(this.player.login);
    return this;
};

PlayerMenu.removeAll = function () {
    $('.player-menu').remove();
};

module.exports = PlayerMenu;