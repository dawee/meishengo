/*
 * Module dependencies
 */

var _ = require('underscore');
var express = require('express');
var app = express();
var http = require('http');
var conf = require('./lib/conf');
var server = http.createServer(app);
var io = require('./lib/io/server')(server);
var GameStore = require('./lib/store/game');


/*
 * Specialize express
 */

app.set('views', __dirname + '/lib/page');
app.set('view engine', 'jade');


/*
 * Register middlewares
 */

app.use('/assets', express.static(__dirname + '/lib/asset'));
app.use('/mei', express.static(__dirname + '/build'));


/*
 * Register routes
 */


/* Game route */

app.get(/^\/(game|g)\/([a-z0-9\-]{3,15}[a-z0-9]{1})$/, function (req, res) {
  var debug = conf.get('debug');
  var id = req.params[1];

  GameStore.fetch(id, function (err, game) {
    res.render('game', {
      js: debug ? '/mei/game.min.js' : '/mei/game.js',
      css: debug ? '/mei/game.min.css' : '/mei/game.css',
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
