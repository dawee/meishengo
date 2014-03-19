var hyperquest = require('hyperquest');
var async = require('async');
var _ = require('underscore');

var Game = require('./game');


// exports boot
window.boot = function (opts) {
  var socket = io.connect();

  if (!opts.goban) {
    var button = document.querySelector('.popup.create button');
    var popup = document.querySelector('.popup.create');

    _.defer(function () {
      popup.classList.remove('class', 'reduced');
    });

    button.addEventListener('click', function () {
      var sizeSelector = document.querySelector('.popup.create select');
      var sizeChoice = document.querySelectorAll('.popup.create option')[sizeSelector.selectedIndex];

      hyperquest.post('http://localhost:8000/game/' + opts.id + '/goban', function (err, res) {
        if (!!err) return;
        new Game({size: parseInt(sizeChoice.getAttribute('value'), 10)});
      }).end();
    });
  } else {
    new Game(opts.goban);
  }

};