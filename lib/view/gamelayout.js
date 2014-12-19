'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var async = require('async');
var template = require("../template/gamelayout.jade");
var CreationBoardView = require('./creationboard');
var Mei = require('./mei');
var GameContent = require('./gamecontent');
var SideForm = require('./sideform');


/*
 * GameLayout
 */

var GameLayout = module.exports = Mei.View.extend();

GameLayout.prototype.className = 'mei-game-layout';

GameLayout.prototype.events = {
  'keypress input.prompt': 'sendMessage'
};

GameLayout.prototype.initialize = function (opts) {
  _.bindAll(this,
    'openGame',
    'sendMessage'
  );

  this.model = opts.model;
  this.sideForm = new SideForm();
  // Events echos
  this.sideForm.echo(this, 'greetings:request', 'token:request');
  // Events local binding
  this.on('creation:request', this.showCreationBoard);
  this.on('game:created', this.openGame);
};

GameLayout.prototype.showCreationBoard = function (evt) {
  var creationBoard = new CreationBoardView(evt);
  this.echo(creationBoard, 'submit', 'game:create');
  this.once('game:created', function () {
      creationBoard.close();
      _.delay(creationBoard.remove, 1000);
  });
  this.$el.append(creationBoard.render().el);
};

GameLayout.prototype.openGame = function (data) {
  this.model.set(data);
  this.content = new GameContent({model: this.model});
  $('.mei-content', this.$el).append(this.content.render().el);

  this.content.resize();
  $(window).on('resize', this.content.resize);
  _.defer(this.content.show);
};

GameLayout.prototype.sendMessage = function (evt) {
  var pressedReturn = (evt.keyCode === 13);
  var value = this.prompt.value;

  if (pressedReturn && value.length > 0) {
    this.trigger('chat:message', {content: value});
    this.prompt.value = '';
  }

};

/* Append sub layers */

GameLayout.prototype.render = function () {
  this.$el.append(template({
    game: this.model.toJSON()
  }));

  this.$el.append(this.sideForm.render().el);
  this.prompt = $('input.prompt', this.$el)[0];

  if (this.model.has('id')) _.defer(this.openGame);
  return this;
};
