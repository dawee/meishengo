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
    console.log('echoing', origin, destination || origin);
    recipient.emit(destination || origin, data);
  });
};

/* Alias for plugs (same behavior as socket) */

View.prototype.emit = View.prototype.trigger;