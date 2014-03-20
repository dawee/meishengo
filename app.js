var express = require('express');
var http = require('http');
var Game = require('./lib/server/game');
var sio = require('socket.io');

var app = express();
var server = http.createServer(app)
var io = sio.listen(server);

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/view');
app.set('view engine', 'jade');

app.get('/game/:id', function (req, res) {
  var game = Game(req.params.id, io);
  res.render('game', {
    id: req.params.id,
    hasGoban: game.gbn() !== null,
    goban: JSON.stringify(game.gbn())
  });
});

app.post('/game/:id/goban', function (req, res) {
  var game = Game(req.params.id, io);
  var data = game.createGoban();
  res.json(data.code, data);
});

app.post('/game/:id/player/:color', function (req, res) {
  var game = Game(req.params.id, io);
  var data = game.joinRequest(req.params.color);
  res.json(data.code, data);
});

io.sockets.on('connection', Game.listen);

server.listen(8000);
