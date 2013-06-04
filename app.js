var path = require('path'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    proxy = require('pandanet-io-proxy');

proxy.listen(server);
app.set('view engine', 'jade');
app.use('/build', express.static(path.join(__dirname, 'public', 'build')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.get('/', function (req, res) {
    res.render('index', {version: Date.now()});
});
server.listen(8888);