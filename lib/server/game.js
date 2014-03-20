var _ = require('underscore');
var crypto = require('crypto');
var Goban = require('../common/goban');

var instances = {};

var Game = module.exports = function (id, io) {
  if (_.has(instances, id)) return instances[id];
  if (!(this instanceof Game)) return new Game(id, io);

  this.id = id;
  this.tokens = {};
  this.io = io;
  instances[id] = this;
};

Game.listen = function (socket) {
  socket.on('join', function (data) {
    if (_.has(instances, data.id)) instances[data.id].join(socket, data.token);
  });
};

var game = Game.prototype;

game.join = function (socket, token) {
  if (!this.goban) return;
  if (!_.contains(_.values(this.tokens), token)) return;
  if (this.tokens.black === token) socket.player = 'black';
  if (this.tokens.white === token) socket.player = 'white';

  socket.join('game' + this.id);
  if (this.tokens.black && this.tokens.white) {
    this.io.sockets.in('game' + this.id).emit('game:start');
    this.io.sockets.in('game' + this.id).emit('game:turn:' + this.goban.turn);
  }
};

game.gbn = function () {
  return !!this.goban ? this.goban.dump() : null; 
};

game.joinRequest = function (color) {
  if (!this.goban) return {code: 404};
  if (!_.contains(['black', 'white'], color)) return {code: 400};
  if (_.contains(_.keys(this.tokens), color)) return {code: 410};
  var token = crypto.randomBytes(6).toString('hex');
  
  this.tokens[color] = token;
  return {code: 200, token: token};
};

game.putStone = function (opts) {
  if (!this.goban) return {code: 404};
  if (!_.has(opts, 'row') || !_.has(opts, 'col')) return {code: 400};
  if (!_.has(opts, 'token')) return {code: 400};
  if (!_.has(opts, 'color')) return {code: 400};
  
  if (this.tokens[opts.color] !== opts.token) return {code: 403};

  if (!this.goban.putStone(opts.row, opts.col, opts.color)) return {code: 410};

  this.io.sockets.in('game' + this.id).emit('stone:put', opts);
  this.io.sockets.in('game' + this.id).emit('game:turn:' + this.goban.turn);
  return {code: 200};
};

game.createGoban = function (opts) {
  if (!!this.goban) return {code: 409};

  this.goban = new Goban(opts);
  return {code: 200, goban: this.goban.dump()};
};

game.bind = function (soket, name, handler) {
  socket.on(name, function (data) {
    handler(socket, data);
  });
};