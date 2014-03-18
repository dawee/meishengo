var _ = require('underscore');

var instances = {};

var Game = module.exports = function (id, io) {
  if (_.has(instances, id)) return instances[id];
  if (!(this instanceof Game)) return new Game(id, io);
  
  this.id = id;
  instances[id] = this;
};

Game.listen = function (socket) {
  socket.on('join', function (data) {
    if (_.has(instances, data.game)) instances[data.game].join(socket);
  });
};

var game = Game.prototype;

game.join = function (socket) {
  console.log('joined', this.id);
};