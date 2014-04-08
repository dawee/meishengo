var _ = require('underscore');
var Popup = require('./popup');
var GobanUX = require('./ux/goban');
var SeatUX = require('./ux/seat');
var notify = require('./notify');
var socket;

var Game = module.exports = function (id, goban, socketHost) {
  _.bindAll(this,
    'addMarkup',
    'ending',
    'joinGameAsWhite',
    'joinGameAsBlack',
    'observeGame',
    'rmMarkup',
    'putStone',
    'pass',
    'toggleStoneMarkup'
  );
  
  socket = io.connect(socketHost);

  var createPopup = new Popup('create');
  var joinPopup = new Popup('join');
  var blackChoice = document.querySelector('.popup.join .choice.black');
  var whiteChoice = document.querySelector('.popup.join .choice.white');
  var observerChoice = document.querySelector('.popup.join .choice.observer');
  var gameEl = document.getElementById('game');

  this.id = id;
  this.goban = goban;
  this.gobanUX = new GobanUX(goban);

  this.seats = {
    black: new SeatUX('black'),
    white: new SeatUX('white')
  };
  
  _.each(this.seats, function (seat, color) {
    gameEl.appendChild(seat.render().el);
    socket.on('game:joined:' + color, seat.taken);
    this.goban.on('prisoners', function (prisoners) {
      var opponent = (color === 'black' ? 'white' : 'black');
      seat.setPrisoners(prisoners[opponent]);
    });
  }, this);

  socket.on('stone:put', this.putStone);

  socket.on('goban:turn', function (args) {
    goban.setTurn(args.color);
  });

  socket.on('goban:markup:rm', this.rmMarkup);
  socket.on('goban:markup:add', this.addMarkup);

  this.gobanUX.on('stone:put', this.putStone);
  this.gobanUX.on('stone:markup:toggle', this.toggleStoneMarkup);
  createPopup.hide(joinPopup.show);
  
  gameEl.appendChild(this.gobanUX.render().el);

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

game.addMarkup = function (evt) {
  this.goban.addGroupMarkupAt(evt.row, evt.col, evt.markup);
};

game.rmMarkup = function (evt) {
  this.goban.rmGroupMarkupAt(evt.row, evt.col, evt.markup);
};

game.joinGame = function (color) {
  var that = this;
  var joinPopup = new Popup('join');
  var opponent = (color === 'black' ? 'white' : 'black');

  this.color = color;
  oboe({method: 'POST', url: '/game/' + this.id + '/player', body: {color: color}}).done(function (data) {
    that.token = data.token;
    that.gobanUX.setColor(color);
    
    that.seats[color].taken();
    that.seats[color].setOwner('player');
    that.seats[opponent].setOwner('opponent');
    socket.emit('join', {id: that.id, token: data.token});
    socket.on('game:start', function () {
      notify('Game started');
      that.gobanUX.unlock();
    });
    socket.on('goban:turn:' + color, function () {
      notify('Your turn');
      that.seats[that.color].activate();
    });
    socket.on('goban:turn:' + opponent, that.seats[color].deactivate);
    socket.on('game:ending', that.ending);

    that.seats[color].on('action:pass', that.pass);
    joinPopup.hide();
  });
};

game.ending = function () {
  this.goban.editable = true;
  this.goban.countTerritories(this.gobanUX.showTerritories);
};

game.pass = function () {
  oboe({method: 'POST', url: '/game/' + this.id + '/nop', body: {token: this.token}});
  this.goban.toggleTurn();
  this.seats[this.color].deactivate();
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
    this.goban.toggleTurn();
    _.delay(this.seats[this.color].wontEndGame, 1000);
  }
};

game.toggleStoneMarkup = function (evt) {
  if (!evt.ux || !this.goban.toggleGroupMarkupAt(evt.row, evt.col, 'dead')) return;

  if (this.goban.hasGroupMarkupAt(evt.row, evt.col, 'dead')) {
    oboe({method: 'POST', url: '/game/' + this.id + '/markup', body: {
      token: this.token,
      row: evt.row,
      col: evt.col,
      markup: evt.markup
    }});
  } else {
    oboe({method: 'DELETE', url: '/game/' + this.id + '/markup', body: {
      token: this.token,
      row: evt.row,
      col: evt.col,
      markup: evt.markup
    }});
  }
};
