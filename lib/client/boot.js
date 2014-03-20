var async = require('async');
var _ = require('underscore');

var Game = require('./game');


// exports boot
window.boot = function (opts) {
  if (!opts.goban) {
    var button = document.querySelector('.popup.create button');
    var popup = document.querySelector('.popup.create');

    _.defer(function () {
      popup.classList.remove('class', 'reduced');
    });

    button.addEventListener('click', function () {
      var sizeSelector = document.querySelector('.popup.create select');
      var sizeChoice = document.querySelectorAll('.popup.create option')[sizeSelector.selectedIndex];

      oboe({url: '/game/' + opts.id + '/goban', method: 'POST'}).done(function (data) {
        if(data.goban) new Game(opts.id, data.goban);
      });
    });
  } else {
    new Game(opts.id, opts.goban);
  }

};