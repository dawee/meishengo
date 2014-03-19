var hyperquest = require('hyperquest');
var async = require('async');
var GobanUX = require('./goban-ux');


// exports boot
window.boot = function (opts) {
  var socket = io.connect();

  if (!opts.goban) {
    var button = document.querySelector('.popup.create button');
    var popup = document.querySelector('.popup.create');
    setTimeout(function () {
      popup.classList.remove('class', 'reduced');
    }, 500);

    button.addEventListener('click', function () {
      hyperquest.post('http://localhost:8000/game/' + opts.id + '/goban', function (res) {
        popup.classList.add('class', 'reduced');
      }).end();
    });
  } else {
    var gobanUX = new GobanUX(opts.goban);
    document.getElementById('content').appendChild(gobanUX.render().el);
  }

};