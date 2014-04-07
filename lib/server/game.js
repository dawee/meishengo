var _ = require('underscore');
var crypto = require('crypto');
var Goban = require('../common/goban');
var nconf = require('nconf');

var instances = {};

var Game = module.exports = function (id, io) {
  if (_.has(instances, id)) return instances[id];
  if (!(this instanceof Game)) return new Game(id, io);

  _.bindAll(this, 'kill');
  this.id = id;
  this.tokens = {};
  this.observers = [];
  this.io = io;
  instances[id] = this;
  this.lastPassed = false;
};

Game.listen = function (socket) {
  socket.on('join', function (data) {
    if (_.has(instances, data.id)) instances[data.id].join(socket, data.token);
  });

  socket.on('observe', function (data) {
    if (_.has(instances, data.id)) instances[data.id].observe(socket);
  });
};

var game = Game.prototype;

game.delayVerdict = function () {
  var that = this;

  this.cancelVerdict();
  this.killId = setTimeout(this.kill, nconf.get('repreive'));
};

game.cancelVerdict = function () {
  if (!!this.killId) clearTimeout(this.killId);
  this.killId = null;
};

game.rejectAll = function (sockets) {
  _.each(sockets, function (socket) {
    socket.leave('game' + this.id);
  }, this);
};

game.kill = function () {
  delete instances[this.id];
  delete this.goban;
  this.rejectAll(this.tokens);
  this.rejectAll(this.observers);
  this.tokens = {};
  this.observers = [];
  this.io = null;
};

game.join = function (socket, token) {
  var broadcast;

  if (!this.goban) return;
  if (!_.contains(_.values(this.tokens), token)) return;
  if (this.tokens.black === token) socket.player = 'black';
  if (this.tokens.white === token) socket.player = 'white';

  this.cancelVerdict();
  socket.join('game' + this.id);
  broadcast = this.io.sockets.in('game' + this.id);
  this.emitJoinedPlayer(broadcast, socket.player);
  this.emitJoinedPlayers(socket);

  if (this.tokens.black && this.tokens.white) {
    broadcast.emit('game:start');
    broadcast.emit('game:turn:' + this.goban.turn);
  }
};

game.emitJoinedPlayers = function (socket) {
  if (_.has(this.tokens, 'black')) this.emitJoinedPlayer(socket, 'black');
  if (_.has(this.tokens, 'white')) this.emitJoinedPlayer(socket, 'white');
};


game.emitJoinedPlayer = function (socket, color) {
  socket.emit('game:joined:' + color);
};

game.observe = function (socket) {
  if (!this.goban) return;

  socket.join('game' + this.id);
  socket.emit('goban:reset', this.gbn() || {});
  this.emitJoinedPlayers(socket);
  this.observers.push(socket);
};

game.gbn = function () {
  return !!this.goban ? this.goban.dump() : null; 
};

game.hasPlayer = function (color) {
  return _.has(this.tokens, color);
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

  this.lastPassed = false;
  this.io.sockets.in('game' + this.id).emit('stone:put', opts);
  _.defer(this.goban.toggleTurn);
  return {code: 200};
};

game.createGoban = function (opts) {
  if (!!this.goban) return {code: 409};
  
  this.delayVerdict();
  this.goban = new Goban(opts);
  
  var broadcast = this.io.sockets.in('game' + this.id);

  this.goban.on('turn', function (args) {
    broadcast.emit('goban:turn:' + args.color);
    broadcast.emit('goban:turn', args);
  });
  return {code: 200, goban: this.goban.dump()};
};

game.pass = function (opts) {
  if (!this.goban) return {code: 404};
  if (!_.has(opts, 'token')) return {code: 400};
  if (this.tokens[this.goban.turn] !== opts.token) return {code: 403};

  var broadcast = this.io.sockets.in('game' + this.id);
  
  if (this.lastPassed) {
    this.goban.editable = true;
    broadcast.emit('game:ending');
  } else {
    this.goban.toggleTurn();
    this.lastPassed = true;
  }

  return {code: 200};
};

game.addMarkup = function (opts) {
  if (!this.goban) return {code: 404};
  if (!_.has(opts, 'token')) return {code: 400};
  if (!_.has(opts, 'row')) return {code: 400};
  if (!_.has(opts, 'col')) return {code: 400};
  if (!this.goban.editable) return {code: 403};
  if (!_.contains(_.values(this.tokens), opts.token)) return {code: 403};

  var broadcast = this.io.sockets.in('game' + this.id);

  this.goban.addGroupMarkupAt(opts.row, opts.col, opts.markup);
  broadcast.emit('goban:markup:add', {row: opts.row, col: opts.col, markup: opts.markup})
  return {code: 200};
};

game.rmMarkup = function (opts) {
  if (!this.goban) return {code: 404};
  if (!_.has(opts, 'token')) return {code: 400};
  if (!_.has(opts, 'row')) return {code: 400};
  if (!_.has(opts, 'col')) return {code: 400};
  if (!this.goban.editable) return {code: 403};
  if (!_.contains(_.values(this.tokens), opts.token)) return {code: 403};

  var broadcast = this.io.sockets.in('game' + this.id);

  this.goban.rmGroupMarkupAt(opts.row, opts.col, opts.markup);
  broadcast.emit('goban:markup:rm', {row: opts.row, col: opts.col, markup: opts.markup})
  return {code: 200};
};
