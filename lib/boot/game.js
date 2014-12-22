'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var Backbone = require('backbone');
var Game = require('../model/game');
var GameLayout = require('../view/gamelayout');

/* 
 * Events mapping
 */

var events = {};

// From socket to layout

events.fromSocket = [
  'game:created',
  'game:player:request',
  'game:joined',
  'game:updated',
  'greetings:accepted',
  'greetings:request',
  'greetings:refused',
  'register:failed',
  'register:succeeded'
];

// From layout to socket

events.fromLayout = [
  'game:create',
  'game:join',
  'game:spectate',
  'game:stone:put',
  'greetings',
  'player:heartbeat',
  'register'
];


function repeater(emitter, recipient, mei) {
  return function (name) {
    mei.echo(emitter, name, name, recipient);
  };
};

/* Boot method */

window.boot = function (opts) {
  var socket = io.connect('http://' + window.location.hostname + ':' + opts.port);
  var layout = new GameLayout({model: new Game(opts.game)});

  _.each(events.fromLayout, repeater(layout, socket, layout));
  _.each(events.fromSocket, repeater(socket, layout, layout));
  $(document.body).append(layout.render().el);

  if (!opts.game) {
    layout.trigger('creation:request', opts);
  } else {
    layout.trigger('game:created', opts);
  }
};

/* Link Backbone to jBone */

Backbone.$ = $;