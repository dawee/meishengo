'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var depot = require('depot/depot');
var template = require('../template/chatbox.jade');
var Mei = require('./mei');


/*
 * Exports ChatBox
 */

var ChatBox = module.exports = Mei.View.extend();


/* Read player from store */

ChatBox.prototype.initialize = function () {
  this.player = depot('mei.player').all()[0];
};

/* Load chatbox template */

ChatBox.prototype.render = function () {
  this.$el.append(template({player: this.player}))
  return this;
};
