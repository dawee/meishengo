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

  // Append Game layout


  if (!opts.game) {
    // If no game : show creation board

    layout.trigger('creation:request', opts);
  } else {
    // If game exists : connect view and socket via the game plug

    layout.model.set(opts.game);
  }

  // Plug layout to socket events

  // From socket -> To layout
  layout.echo(socket, 'greetings:request', null, layout);
  // From layout -> To socket
  layout.echo(layout, 'game:create', null, socket);

  $(document.body).append(layout.render().el);
};

/* Link Backbone to jBone */

Backbone.$ = $;