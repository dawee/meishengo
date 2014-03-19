var _ = require('underscore');
var GobanUX = require('./goban-ux');

var Game = module.exports = function (goban) {
  var createPopup = document.querySelector('.popup.create');
  var joinPopup = document.querySelector('.popup.join');
  var gobanUX = new GobanUX(goban);

  _.defer(function () {
    createPopup.classList.add('class', 'reduced');
    joinPopup.classList.remove('class', 'reduced');
    _.delay(function () {
      createPopup.classList.add('class', 'hidden');
    }, 1000);
  });
  document.getElementById('content').appendChild(gobanUX.render().el);
};

var game = Game.prototype;
