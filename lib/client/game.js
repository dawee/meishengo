var _ = require('underscore');
var Popup = require('./popup');
var GobanUX = require('./goban-ux');
var socket = io.connect();

var Game = module.exports = function (id, goban) {
  _.bindAll(this, 'joinGameAsWhite', 'joinGameAsBlack', 'observeGame');

  var createPopup = new Popup('create');
  var joinPopup = new Popup('join');
  var blackChoice = document.querySelector('.popup.join .choice.black');
  var whiteChoice = document.querySelector('.popup.join .choice.white');
  var observerChoice = document.querySelector('.popup.join .choice.observer');

  this.id = id;
  this.goban = goban;
  this.gobanUX = new GobanUX(goban);

  socket.on('stone:put', _.bind(this.putStone, this));
  this.gobanUX.on('stone:put', _.bind(this.putStone, this));
  createPopup.hide(joinPopup.show);
  document.getElementById('game').appendChild(this.gobanUX.render().el);
  if (!!whiteChoice) whiteChoice.addEventListener('click', this.joinGameAsWhite);
  if (!!blackChoice) blackChoice.addEventListener('click', this.joinGameAsBlack);
  if (!!observerChoice) observerChoice.addEventListener('click', this.observeGame);
};

var game = Game.prototype;

game.joinGameAsWhite = function () {
  this.joinGame('white');
};

game.joinGameAsBlack = function () {
  this.joinGame('black');
};

game.joinGame = function (color) {
  var that = this;
  var joinPopup = new Popup('join');
  var opponent = (color === 'black' ? 'white' : 'black');

  this.color = color;
  oboe({method: 'POST', url: '/game/' + this.id + '/player', body: {color: color}}).done(function (data) {
    that.token = data.token;
    that.gobanUX.setColor(color);
    socket.emit('join', {id: that.id, token: data.token});
    socket.on('game:start', that.gobanUX.unlock);
    joinPopup.hide();
  });
};

game.observeGame = function () {
  var joinPopup = new Popup('join');
  socket.on('goban:reset', this.goban.reset);
  socket.emit('observe', {id: this.id});
  joinPopup.hide();
};

game.sendPutStone = function (evt) {
  var params = _.extend(evt, {
    color: this.color,
    token: this.token
  });

  oboe({method: 'POST', url: '/game/' + this.id + '/stone', body: params});
};

game.putStone = function (evt) {
  if (this.goban.putStone(evt.row, evt.col, evt.color) && evt.ux) {
    this.sendPutStone(_.omit(evt, 'ux'));
  }
};
