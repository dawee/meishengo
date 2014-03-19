var hyperquest = require('hyperquest');
var async = require('async');
var GobanUX = require('./goban-ux');
var _ = require('underscore');

// exports boot
window.boot = function (opts) {
  var socket = io.connect();

  if (!opts.goban) {
    var button = document.querySelector('.popup.create button');

    _.defer(function () {
      popup.classList.remove('class', 'reduced');
    });

    button.addEventListener('click', function () {
      var sizeSelector = document.querySelector('.popup.create select');
      var sizeChoice = document.querySelectorAll('.popup.create option')[sizeSelector.selectedIndex];

      hyperquest.post('http://localhost:8000/game/' + opts.id + '/goban', function (err, res) {
        if (!!err) return;
        var popup = document.querySelector('.popup.create');
        var gobanUX = new GobanUX({size: parseInt(sizeChoice.getAttribute('value'), 10)});
       
        popup.classList.add('class', 'reduced');
        document.getElementById('content').appendChild(gobanUX.render().el);
      }).end();
    });
  } else {
    var gobanUX = new GobanUX(opts.goban);
    document.getElementById('content').appendChild(gobanUX.render().el);
  }

};