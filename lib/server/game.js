var _ = require('underscore');
var crypto = require('crypto');

var instances = {};

var Game = module.exports = function (id, io) {
  if (_.has(instances, id)) return instances[id];
  if (!(this instanceof Game)) return new Game(id, io);

  this.id = id;
  this.tokens = {};
  instances[id] = this;
};

Game.listen = function (socket) {
  socket.on('join', function (data) {
    if (_.has(instances, data.game)) instances[data.game].join(socket, data.token);
  });
};

var game = Game.prototype;

game.join = function (socket, token) {
  if (!_contains(_.values(this.tokens), token)) return;
  if (this.tokens.black === token) socket.player = 'black';
  if (this.tokens.white === token) socket.player = 'white';

  socket.join('game' + this.id);
};

game.joinRequest = function (color) {
  if (!_.contains(['black', 'white'], color)) return {code: 400};
  if (_.contains(_.keys(this.tokens), color)) return {code: 410};
  var token = crypto.randomBytes(6).toString('hex');
  
  this.tokens[color] = token;
  return {code: 200, token: token};
};

game.bind = function (soket, name, handler) {
  socket.on(name, function (data) {
    handler(socket, data);
  });
};