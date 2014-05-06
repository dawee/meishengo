var express = require('express');
var http = require('http');
var sio = require('socket.io');
var expressLess = require('express-less');
var browserifyExpress = require('browserify-express');
var _ = require('underscore');
var nconf = require('nconf');

nconf.env().argv();
nconf.file(__dirname + '/config.json');
nconf.defaults({
  debug: false,
  port: 8000,
  repreive: 30000,
  host: 'localhost'
});

var app = express();
var server = http.createServer(app)
var io = sio.listen(server, { log: nconf.get('debug') });

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.set('views', __dirname + '/view');
app.set('view engine', 'jade');
app.use('/less', expressLess(__dirname + '/lib/client/style', {compress: !nconf.get('debug')}));
app.use(browserifyExpress({
    entry: __dirname + '/lib/client/boot.js',
    watch: __dirname + '/lib/client/',
    mount: '/js/meishengo-client.js',
    minify: !nconf.get('debug')
}));

app.gameRequest = function (req, res) {
  res.render('game');
};

app.get('/game/:id', app.gameRequest);
app.get('/g/:id', app.gameRequest);

app.use(function(req, res) {
  res.render('404', {sentence: _.sample(proverbs)});
});

console.log('Meishengo started on port ' + nconf.get('port'));
server.listen(nconf.get('port'));
