'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var Mei = require('./mei');


/*
 * Exports ChatBox
 */

var ChatBox = module.exports = Mei.View.extend();

ChatBox.prototype.className = 'mei-chatbox';


/* Read player from store */

ChatBox.prototype.initialize = function () {
};

/* Load chatbox template */

ChatBox.prototype.render = function () {
  return this;
};
