var http = require('http');
var async = require('async');

// exports boot
window.boot = function (opts) {
  var socket = io.connect();

  if (!opts.goban) {
    var button = document.querySelector('.popup.create button');

    button.addEventListener('click', function () {
      http.request({path: '/game/' + opts.id + '/goban', method: 'POST'}, function (res) {

        console.log(res.code);

      }).end();
    });
  }

};