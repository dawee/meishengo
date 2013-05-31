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
    this.socket.once('auth:request', this.onAuthRequest);
};

LoginForm.prototype.onAuthRequest = function () {
    console.log('auth request');
    this.socket.once('auth:success', this.onAuthSuccess);
    console.log($('.login', this.$el).val());
    console.log($('.password', this.$el).val());
    this.socket.emit('auth:sending', {
        login: $('.login', this.$el).val(),
        password: $('.password', this.$el).val()
    });
};

LoginForm.prototype.onAuthSuccess = function () {
    alert('authenticated !');
};

module.exports = LoginForm;