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
  Game(req.params.id, io);
  res.render('index', {id: req.params.id});
});

app.get('/game/:id/join/:color', function (req, res) {
  var game = Game(req.params.id, io);
  var data = game.joinRequest(req.params.color);
  res.writeHead(data.code, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(data));
  res.end();
});

io.sockets.on('connection', Game.listen);

server.listen(8000);
