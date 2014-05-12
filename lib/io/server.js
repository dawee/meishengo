/*
 * Module dependencies
 */

var conf = require('../conf');
var socketIO = require('socket.io');
var connection = require('./connection');
var game = require('./game');


/* Wait for http server to initialize */

module.exports = function (server) {
  var io = socketIO.listen(server, { log: conf.get('debug') });

  connection.io = io;
  game.io = io;
  
  io.sockets.on('connection', connection);
  return io;
};

