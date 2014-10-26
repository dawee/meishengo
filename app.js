/*
 * Module dependencies
 */

var _ = require('underscore');
var conf = require('./lib/conf');
var express = require('express');
var http = require('http');
var socketio = require('./lib/io/server');
var hat = require('hat');
var GameStore = require('./lib/store/game');


/*
 * Local referencies
 */

var app = express();
var debug = conf.get('debug');
var server = http.createServer(app);
var io = socketio(server);

/*
 * Specialize express
 */

app.set('views', __dirname + '/lib/template');
app.set('view engine', 'jade');


/*
 * Register middlewares
 */

app.use('/assets', express.static(__dirname + '/lib/asset'));
app.use('/mei', express.static(__dirname + '/build'));


/*
 * Register routes
 */

/* Landing route */

app.get(/^\/?$/, function (req, res) {
  res.render('landing', {
    title: conf.get('title'),
    css: debug ? '/mei/landing.css' : '/mei/landing.min.css',
    js: debug ? '/mei/landing.js' : '/mei/landing.min.js', 
  });
});

/* New game route */

app.get(/^\/?new\-game\/?/, function (req, res) {
  res.redirect('/game/' + hat(64, 16));
});

/* Game route */

app.get(/^\/(game|g)\/([\w\-]{3,16})$/, function (req, res) {
  var id = req.params[1];

  GameStore.fetch(id, function (err, game) {
    res.render('game', {
      title: conf.get('title'),
      js: debug ? '/mei/game.js' : '/mei/game.min.js', 
      css: debug ? '/mei/game.css' : '/mei/game.min.css',
      port: conf.get('port'),
      id: id,
      game: JSON.stringify(!!game ? game.serialize() : null)
    });
  });
});

/*
 * Start server
 */

console.log('Meishengo started on port ' + conf.get('port'));
server.listen(conf.get('port'));
