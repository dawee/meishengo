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

View.prototype.forward = function (view, namespace) {
  var prefix = !!namespace ? namespace + ':' : '';

  this.on('all', function (name, data) {
    view.trigger(prefix + name, data);
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