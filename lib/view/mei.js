'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var Mei = require('../model/mei');


/* exports Mei */

module.exports = Mei;

/*
 * Mei.View
 */

var View = Mei.View = Backbone.View.extend();


/* Echo event with same or different name */

View.prototype.echo = function (emitter, origin, destination, recipient) {
  emitter = emitter || this;
  recipient = recipient || this;

  emitter.on(origin, function (data) {
    recipient.emit(destination || origin, data);
  });
};

/* Call 'done' callback after transitionend event or timeout */

View.prototype.afterTransition = function (done, timeout, $el) {
  var doneOnce = _.once(done);

  $el = $el || this.$el;
  $el.off('transitionend');
  $el.on('transitionend', doneOnce);
  _.delay(doneOnce, timeout);
};

/* Alias for plugs (same behavior as socket) */

View.prototype.emit = View.prototype.trigger;