/*global window*/
/*jslint nomen: true*/
"use strict";

var instances = {};

exports.createInstance = function (name) {
    instances[name] = window.io.connect();
    return instances[name];
};

exports.getInstance = function (name) {
    return instances[name];
};

