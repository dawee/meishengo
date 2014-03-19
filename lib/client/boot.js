var hyperquest = require('hyperquest');
var async = require('async');

// exports boot
window.boot = function (opts) {
  var socket = io.connect();

  if (!opts.goban) {
    var button = document.querySelector('.popup.create button');
    var popup = document.querySelector('.popup.create');
    popup.classList.remove('class', 'reduced');

    button.addEventListener('click', function () {
      hyperquest.post('http://localhost:8000/game/' + opts.id + '/goban', function (res) {
        popup.classList.add('class', 'reduced');
      }).end();
    });
  }

};