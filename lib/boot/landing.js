'use strict';

/*
 * Module dependencies
 */

var _ = require('underscore');


/* Boot method */

window.boot = function (opts) {
  _.defer(function () {
    document.getElementById('banner').classList.remove('hidden');
    document.getElementById('new-game').classList.remove('hidden');
  });
};
