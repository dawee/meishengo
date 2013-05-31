var path = require('path'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    proxy = require('pandanet-io-proxy');

proxy.listen(server);
app.set('view engine', 'jade');
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/less', express.static(path.join(__dirname, 'public', 'less')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.get('/', function (req, res) {
    res.render('index', {title: 'Meishengo'});
});
app.listen(8888);