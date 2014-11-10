'use strict';

/*
 * Module dependencies
 */

var conf = require('./conf');
var moment = require('moment');
var winston = require('winston');


/* Format time for each log with momentjs */

var formatTime = function() {
    return moment().format('MMMM Do hh:mm:ss');
};

/* Always log to file */

var transports = [
    new winston.transports.DailyRotateFile({
        filename: 'meishengo.log',
        timestamp: formatTime,
        level: conf.get('debug') ? 'debug' : 'error'
    })
];

/* Log to console only when debug mode */

if (conf.get('debug')) {
    transports.push(new winston.transports.Console({
        colorize: true,
        level: 'debug',
        timestamp: formatTime
    }));
}

/* Exports configured logger */

var logger =  module.exports = new winston.Logger({
    exitOnError: false,
    transports: transports
});