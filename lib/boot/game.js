'use strict';

/*
 * Module dependencies
 */

var $ = require('jbone');
var _ = require('underscore');
var Backbone = require('backbone');
var Game = require('../model/game');
var GameLayout = require('../view/gamelayout');


/* Boot method */

window.boot = function (opts) {
  var socket = io.connect('http://' + window.location.hostname + ':' + opts.port);
  var layout = new GameLayout({model: new Game(opts.game)});

  layout.echo(socket, 'greetings:request', null, layout);
  layout.echo(socket, 'game:created', null, layout);
  layout.echo(layout, 'game:create', null, socket);

  if (!opts.game) {
    layout.trigger('creation:request', opts);
  } else {
    layout.trigger('game:created', opts);    
  }

  $(document.body).append(layout.render().el);
};

/* Link Backbone to jBone */

Backbone.$ = $;