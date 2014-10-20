/*
 * Module dependencies
 */

var conf = module.exports = require('nconf');


/* Last fallback : environment variables */

conf.env().argv();

/* Dev fallback : config.json */

conf.file(__dirname + '/../config.json');

/* Default values */

conf.defaults({
  title: 'Meishengo',
  debug: false,
  port: 8000,
  host: 'localhost',
  ttl: 24 * 3600
});
