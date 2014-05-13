/*
 * Module dependencies
 */

var _ = require('underscore');
var conf = require('../conf');
var socketIO = require('socket.io');
var connection = require('./connection');
var game = require('./game');


/* Wait for http server to initialize */

module.exports = function (server) {
  var io = socketIO.listen(server, { log: conf.get('debug') });

  io.sockets.on('connection', function (socket) {
    var ctx = {io: io};

    connection.apply(ctx, [socket]);
  });
  return io;
};

