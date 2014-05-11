/*
 * Module dependencies
 */

var Backbone = require('backbone');
var GobanChoiceView = require('./gobanchoice')
var ColorChoiceView = require('./colorchoice')


/*
 * CreationBoardView
 */

var CreationBoardView = module.exports = Backbone.View.extend();

CreationBoardView.prototype.tagName = 'mei-board-creation';


/* Initialize template and form model */

CreationBoardView.prototype.initialize = function (opts) {
  this.model = new Backbone.Model({size: 19, color: 'black'});

  this.$el
    .append($('<h2>').text('New Game'))
    .append(new GobanChoiceView({model: this.model}).render().el)
    .append($('<h3>').text('Join as'))
    .append(new ColorChoiceView({model: this.model}).render().el)
    .append($('<button>').text('Create'));
};