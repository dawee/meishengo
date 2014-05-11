/*
 * Module dependencies
 */

var _  = require('underscore');
var Backbone = require('backbone');
var GobanChoiceView = require('./gobanchoice')
var ColorChoiceView = require('./colorchoice')
var Spinner = require('spin.js');


/*
 * CreationBoardView
 */

var CreationBoardView = module.exports = Backbone.View.extend();

CreationBoardView.prototype.tagName = 'mei-board-creation';

/* Bind submit event */

CreationBoardView.prototype.events = {
  'click button': 'submit'
};

/* Initialize template and form model */

CreationBoardView.prototype.initialize = function (opts) {
  _.bindAll(this, 'submit');
  this.model = new Backbone.Model({size: 19, color: 'black'});

  this.$button = $('<button>').text('Create');
  this.$el
    .append($('<h2>').text('New Game'))
    .append(new GobanChoiceView({model: this.model}).render().el)
    .append($('<h3>').text('Join as'))
    .append(new ColorChoiceView({model: this.model}).render().el)
    .append(this.$button);
};

/* Submit creation form */

CreationBoardView.prototype.submit = function () {
  var $overlay = $('<mei-overlay>').insertBefore(this.$button);
  this.$button.text('');
  new Spinner({color:this.$button.css('color'), lines: 12, width: 2}).spin(this.$button[0]);
  _.defer(function () {
    $overlay.css('opacity', 0.5);
  });
};