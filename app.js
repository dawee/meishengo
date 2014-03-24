var express = require('express');
var http = require('http');
var Game = require('./lib/server/game');
var sio = require('socket.io');
var expressLess = require('express-less');
var browserifyExpress = require('browserify-express');
var _ = require('underscore');

var app = express();
var server = http.createServer(app)
var io = sio.listen(server);
var proverbs = [
  'Never attempt to take a move back without proper thought.',
  'The first line is the route to many life-and-death problems you\'ll never want to solve twice or meet in a game.',
  'Try to make your opponent\'s vital point somewhere within reach of your sleeve.',
  'The best kind of ladder-breaker is the one you talk your opponent into thinking really works.',
  'There is always a chance your opponent will play tenuki.',
  'Ten points in reverse sente is usually worth as much as five points in gote.',
  'Play small points before non-urgent points.',
  'Play triple-sente points before double-sente points.',
  'It is sometimes necessary to resign; but it is always possible to dispute your opponent\'s count of the game.',
  'There is death in the triple hane.',
  'If you have a stone captured in a ladder, you should try to take it off the board as soon as possible.',
  'Never resign.',
  'It\'s better to live in sente than to die in gote.',
  'Capturing a ponnuki is worth about 39 points.'
]

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.set('views', __dirname + '/view');
app.set('view engine', 'jade');
app.use('/less', expressLess(__dirname + '/lib/client/style', {compress: true}));
app.use(browserifyExpress({
    entry: __dirname + '/lib/client/boot.js',
    watch: __dirname + '/lib/client/',
    mount: '/js/meishengo-client.js',
    minify: true
}));

app.gameRequest = function (req, res) {
  var game = Game(req.params.id, io);
  res.render('game', {
    id: req.params.id,
    hasGoban: game.gbn() !== null,
    goban: JSON.stringify(game.gbn()),
    isBlackFree: !game.hasPlayer('black'),
    isWhiteFree: !game.hasPlayer('white')
  });
};

app.get('/game/:id', app.gameRequest);
app.get('/g/:id', app.gameRequest);

app.post('/game/:id/goban', function (req, res) {
  var game = Game(req.params.id, io);
  var data = game.createGoban(req.body);
  res.json(data.code, data);
});

app.post('/game/:id/player', function (req, res) {
  var game = Game(req.params.id, io);
  var data = game.joinRequest(req.body.color);
  res.json(data.code, data);
});

app.post('/game/:id/stone', function (req, res) {
  var game = Game(req.params.id, io);
  var data = game.putStone(req.body);
  res.json(data.code, data);
});

app.use(function(req, res) {
  res.render('404', {sentence: _.sample(proverbs)});
});


io.sockets.on('connection', Game.listen);

server.listen(8000);
