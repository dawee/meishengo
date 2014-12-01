'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var Mei = require('./mei');
var Message = require('./message');


/*
 * Exports ChatBox
 */

var ChatBox = module.exports = Mei.View.extend();

ChatBox.prototype.className = 'mei-chatbox';


/* Read player from store */

ChatBox.prototype.echoMessage = function (message) {
  var messageView = new Message(message);
  this.$el.append(messageView.render().el);
};
