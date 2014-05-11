/*
 * Module dependencies
 */

var express = require('express');
var app = express();
var http = require('http');
var sio = require('socket.io');
var expressLess = require('express-less');
var browserifyExpress = require('browserify-express');
var _ = require('underscore');
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
app.use('/components', express.static(__dirname + '/bower_components'));
app.use('/less', expressLess(__dirname + '/lib/style', {compress: !conf.get('debug')}));
app.use(browserifyExpress({
    entry: __dirname + '/lib/boot/game.js',
    watch: __dirname + '/lib',
    mount: '/boot.game.js',
    minify: !conf.get('debug')
}));


/*
 * Register routes
 */

app.get('/:path(game|g)/:id', function (req, res) {
  GameStore.fetch(req.params.id, function (err, game) {
    res.render('game', {
      game: JSON.stringify(!!game ? game.serialize() : null)
    });
  });
});

/* 404 fallback */

app.use(function(req, res) {
  res.render('404', {sentence: _.sample(proverbs)});
});

/*
 * Start server
 */

console.log('Meishengo started on port ' + conf.get('port'));
server.listen(conf.get('port'));
