/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var StoneGroup = require('./stonegroup');


/*
 * Private StoneGroupArray collection
 */

var StoneGroupArray = Backbone.Collection.extend({model: StoneGroup});


/*
 * Goban model
 *
 * @key size (9 / 13 / 19)
 * @key groups
 */

var Goban = module.exports = Backbone.Model.extend();
