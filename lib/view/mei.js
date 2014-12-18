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


/* Forward all specified events */

View.prototype.forward = function (emitter, namespace, events) {
  var that = this;
  var prefix = !!namespace ? namespace + ':' : '';

  if (!events) {
    this.on('all', function (name, data) {
      emitter.emit(prefix + name, data);
    });
  } else {
    events.forEach(function (name) {
      that.on(name, function (data) {
        emitter.emit(prefix + name, data);
      });
    });
  }

};

/* Retrieve specifics events from another emitter */

View.prototype.sniff = function (emitter, namespace, events) {
  var that = this;

  events.forEach(function (name) {
    emitter.on(name, function (data) {
      that.trigger(name, data);
    });
  });
};

/* Echo event with same or different name */

View.prototype.echo = function (origin, destination) {
  var that = this;

  this.on(origin, function (data) {
    that.trigger(destination || origin, data);
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