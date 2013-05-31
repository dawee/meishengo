var _ = require('underscore'),
    $ = require('jquery'),
    template = require('./form-template');

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
    this.socket.on('auth:request', this.onAuthRequest);
    return false;
};

LoginForm.prototype.onAuthRequest = function () {
    this.socket.emit('auth:sending', {
        login: $('.login', this.$el).val(),
        password: $('.password', this.$el).val()
    });
};

module.exports = LoginForm;