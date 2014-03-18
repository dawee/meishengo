// exports boot
window.bootKoban = function (id) {
 var socket = io.connect();
 socket.emit('join', {game: id});
 socket.emit('hello');
 
};