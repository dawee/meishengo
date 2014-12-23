'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var template = require('../template/chatbox.jade');
var Mei = require('../mei');
var Message = require('./message');


/*
 * Exports ChatBox
 */

var ChatBox = module.exports = Mei.View.extend();

ChatBox.prototype.className = 'mei-chatbox';
ChatBox.prototype.events = {
  'message:player': 'echoPlayerMessage',
  'message:system': 'echoSystemMessage'
}


/* Echo message from player  */

ChatBox.prototype.echoPlayerMessage = function (message) {
  var messageView = new Message(_.extend({type: 'normal'}, message));
  this.$wrapper.append(messageView.render().el);
};

/* Echo message from system (no nickname to show) */

ChatBox.prototype.echoSystemMessage = function (message) {
  var messageView = new Message(_.extend({type: 'system'}, message));
  this.$wrapper.append(messageView.render().el);
};


/* Append chatbox wrapper (scrolling) */

ChatBox.prototype.render = function () {
  this.$el.append(template());
  this.$wrapper = $('.wrapper', this.$el);
  return this;
};
