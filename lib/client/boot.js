var async = require('async');
var _ = require('underscore');
var Popup = require('./popup');


var Game = require('./game');
var Goban = require('../common/goban');

// exports boot
window.boot = function (opts) {
  if (!opts.goban) {
    var button = document.querySelector('.popup.create button');
    var createPopup = new Popup('create');
    createPopup.show();

    button.addEventListener('click', function () {
      var sizeSelector = document.querySelector('.popup.create select');
      var sizeChoice = document.querySelectorAll('.popup.create option')[sizeSelector.selectedIndex];
      var params = {
        size: parseInt(sizeChoice.getAttribute('value'), 10)
      };

      oboe({url: '/game/' + opts.id + '/goban', method: 'POST', body: params}).done(function (data) {
        if(data.goban) new Game(opts.id, new Goban(data.goban), opts.socket);
      });
    });
  } else {
    new Game(opts.id, new Goban(opts.goban), opts.socket);
  }

};