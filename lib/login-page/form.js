var _ = require('underscore'),
    $ = require('jquery'),
    template = require('./form-template'),
    page = require('page');

function LoginForm() {
    _.bindAll(this);
}

LoginForm.prototype.render = function() {
    this.$el = $(template);
    this.$el.submit(this.onConnect);
    return this;
};

LoginForm.prototype.onConnect = function(event) {
    event.preventDefault();
    this.socket = io.connect();
    this.socket.once('auth:request', this.onAuthRequest);
};

LoginForm.prototype.onAuthRequest = function () {
    this.socket.once('auth:success', this.onAuthSuccess);
    this.socket.emit('auth:sending', {
        login: $('.login', this.$el).val(),
        password: $('.password', this.$el).val()
    });
};

LoginForm.prototype.onAuthSuccess = function () {
    this.$el.animate({opacity: 0},{duration: 2000, done: this.openHomePage});
};

LoginForm.prototype.openHomePage = function () {
    page('#!/home');
};

module.exports = LoginForm;