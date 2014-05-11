/*
 * Module dependencies
 */

var _ = require('underscore');
var Backbone = require('backbone');
var Goban = require('../model/goban');
var GobanView = require('./goban');


/*
 * GobanOption : Private View
 */

var GobanOption = GobanView.extend();

/* Bind select event */

GobanOption.prototype.events = {
  'mousedown': 'select'
};

/* Listen to form change event */

GobanOption.prototype.initialize = function (opts) {
  _.bindAll(this, 'render', 'select');
  GobanView.prototype.initialize.apply(this, arguments);
  this.form = opts.form;
  this.form.on('change', this.render);
};

/* Update form on select */

GobanOption.prototype.select = function () {
  this.form.set('size', this.model.get('size'));
};

/* Set element as selected if size of form is current */

GobanOption.prototype.render = function () {
  if (this.form.get('size') === this.model.get('size')) {
    this.$el.addClass('selected');
  } else {
    this.$el.removeClass('selected');
  }
  return this;
};


/*
 * GobanChoiceView
 */

var GobanChoiceView = module.exports = Backbone.View.extend();

GobanChoiceView.prototype.tagName = 'mei-goban-choice';


/* Instanciate the 3 options, forwarding the form model */

GobanChoiceView.prototype.initialize = function () {
  _.bindAll(this, 'render');
  this.model.on('change', this.render);
  this.options = {
    19: new GobanOption({model: new Goban({size: 19}), form: this.model}),
    13: new GobanOption({model: new Goban({size: 13}), form: this.model}),
    9: new GobanOption({model: new Goban({size: 9}), form: this.model})
  };

  _
    .chain(this.options)
    .keys()
    .reverse()
    .each(function (key) {
      this.$el.append(this.options[key].render().el);
    }, this);
};
