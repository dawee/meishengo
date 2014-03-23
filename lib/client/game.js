var _ = require('underscore');
var Popup = require('./popup');
var GobanUX = require('./goban-ux');
var socket = io.connect();

var Game = module.exports = function (id, goban) {
  var createPopup = new Popup('create');
  var joinPopup = new Popup('join');
  var blackChoice = document.querySelector('.popup.join .choice.black');
  var whiteChoice = document.querySelector('.popup.join .choice.white');

  this.id = id;
  this.goban = goban;
  this.gobanUX = new GobanUX(goban);


  socket.on('stone:put', _.bind(function (evt) {
    this.goban.putStone(evt.row, evt.col, evt.color);
  }, this));

  createPopup.hide(joinPopup.show);
  document.getElementById('game').appendChild(this.gobanUX.render().el);
  whiteChoice.addEventListener('click', _.bind(function () { this.joinGame('white'); }, this));
  blackChoice.addEventListener('click', _.bind(function () { this.joinGame('black'); }, this));
  this.goban.on('put:stone', _.bind(this.putStone, this));
};

var game = Game.prototype;

game.joinGame = function (color) {
  var that = this;
  var joinPopup = new Popup('join');
  var opponent = (color === 'black' ? 'white' : 'black');

  this.color = color;
  oboe({method: 'POST', url: '/game/' + this.id + '/player', body: {color: color}}).done(function (data) {
    that.token = data.token;
    that.gobanUX.setColor(color);
    that.goban.on('turn:' + color, that.gobanUX.unlock);
    that.goban.on('turn:' + opponent, that.gobanUX.lock);
    socket.emit('join', {id: that.id, token: data.token});
    socket.on('game:turn:' + color, that.gobanUX.unlock);
    joinPopup.hide();
  });
};

game.sendPutStone = function (evt) {
  var params = _.extend(evt, {
    color: this.color,
    token: this.token
  });

  oboe({method: 'POST', url: '/game/' + this.id + '/stone', body: params});
};

game.putStone = function (evt) {
  if (evt.color === this.color) this.sendPutStone(evt);

  this.gobanUX.showStone(evt);
};
