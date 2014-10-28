'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');


/*
 * Mei.View
 */

var View = exports.View = Backbone.View.extend();


/* Forward all specified events */

View.prototype.forward = function (view, namespace) {
  var prefix = !!namespace ? namespace + ':' : '';

  this.on('all', function (name, data) {
    view.trigger(prefix + name, data);
  });
};
