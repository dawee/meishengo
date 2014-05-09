/*
 * Module dependencies
 */

var conf = require('../conf');
var socketIO = require('socket.io');
var connection = require('./connection');


/* Wait for http server to initialize */

module.exports = function (server) {
  var io = socketIO.listen(server, { log: conf.get('debug') });

  io.sockets.on('connection', connection);
  return io;
};

