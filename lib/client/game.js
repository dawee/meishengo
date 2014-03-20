var _ = require('underscore');
var GobanUX = require('./goban-ux');
var socket = io.connect();

var Game = module.exports = function (id, goban) {
  var createPopup = document.querySelector('.popup.create');
  var joinPopup = document.querySelector('.popup.join');
  var gobanUX = new GobanUX(goban);
  var blackChoice = document.querySelector('.popup.join .choice.black');
  var whiteChoice = document.querySelector('.popup.join .choice.white');

  this.id = id;
  this.goban = goban;
  this.gobanUX = new GobanUX(goban);

  _.defer(function () {
    createPopup.classList.add('class', 'reduced');
    joinPopup.classList.remove('class', 'reduced');
    _.delay(function () {
      createPopup.classList.add('class', 'hidden');
    }, 1000);
  });

  document.getElementById('content').appendChild(this.gobanUX.render().el);

  whiteChoice.addEventListener('click', _.bind(function () {
    this.joinGame('white');
  }, this));

  blackChoice.addEventListener('click', _.bind(function () {
    this.joinGame('black');
  }, this));
};

var game = Game.prototype;

game.joinGame = function (color) {
  var joinPopup = document.querySelector('.popup.join');
  var goban = document.getElementById('goban');

  oboe({method: 'POST', url: '/game/' + this.id + '/player', body: {color: color}}).done(_.bind(function (data) {
    socket.emit('join', {id: this.id, token: data.token});
    _.defer(function () {
      goban.classList.add(color);
      joinPopup.classList.add('class', 'reduced');
      _.delay(function () {
        joinPopup.classList.add('class', 'hidden');
      }, 1000);
    });
  }, this));

};