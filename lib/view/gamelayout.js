'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var async = require('async');
var template = require("../template/gamelayout.jade");
var CreationBoardView = require('./creationboard');
var Mei = require('../mei');
var GameContent = require('./gamecontent');
var SideForm = require('./sideform');


/*
 * GameLayout
 */

var GameLayout = module.exports = Mei.View.extend();

GameLayout.prototype.className = 'mei-game-layout';

GameLayout.prototype.events = {
  'keypress input.prompt': 'sendMessage',
  'creation:request': 'showCreationBoard',
  'game:created': 'openGame',
  'game:joined': 'setPlayer',
  'game:updated': 'updateGame',
  'greetings:accepted': 'keepAlive'
};

GameLayout.prototype.initialize = function (opts) {
  this.model = opts.model;
  this.sideForm = new SideForm();
  // Events echos
  this.sideForm.echo(this, 'game:player:request', 'player:request');
  this.sideForm.echo(this, 'game:joined', 'player:set');
  this.sideForm.echo(this, 'greetings:request', 'token:request');
  this.sideForm.echo(this, 'greetings:refused', 'token:reset');
  this.sideForm.echo(this, 'register:failed', 'player:replace');
  this.sideForm.echo(this, 'register:succeeded', 'token:save');
  this.echo(this.sideForm, 'nickname:submit', 'register');
  this.echo(this.sideForm, 'join', 'game:join');
  this.echo(this.sideForm, 'token', 'greetings');
};

GameLayout.prototype.updateGame = function (data) {
  this.model.set(data.game);
};

GameLayout.prototype.setPlayer = function (evt) {
  this.model.set('playerColor', evt.color);
};

GameLayout.prototype.keepAlive = function (data) {
  this.trigger('player:heartbeat', data);
  _.delay(_.partial(this.keepAlive, data), 10000);
};

GameLayout.prototype.showCreationBoard = function (evt) {
  this.creationBoard = new CreationBoardView(evt);
  this.echo(this.creationBoard, 'submit', 'game:create');
  this.$el.append(this.creationBoard.render().el);
};

GameLayout.prototype.openGame = function (data) {
  if (!!this.creationBoard) {
    this.creationBoard.close();
    _.delay(this.creationBoard.remove, 1000);
  }

  this.model.set(data.game);
  this.content = new GameContent({model: this.model});
  $('.mei-content', this.$el).append(this.content.render().el);

  this.content.show();
  this.content.resize();
  this.trigger('game:spectate', {id: data.game.id});
  this.echo(this.content, 'stone:put', 'game:stone:put');
  this.content.chatbox.echo(this, 'chat:message:player', 'message:player');
  this.content.chatbox.echo(this, 'chat:message:system', 'message:system');
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

  return this;
};
