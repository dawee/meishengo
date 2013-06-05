'use strict';

/**
 * Dependencies
 */
var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var proxy = require('pandanet-io-proxy');

app.set('view engine', 'jade');
app.use('/build', express.static(path.join(__dirname, 'public', 'build')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.get('/', function (req, res) {
  res.render('index', {'version': Date.now()});
});

proxy.listen(server);
server.listen(8888);
