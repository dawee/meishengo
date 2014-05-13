/*
 * Module dependencies
 */

var $ = require('zepto').$;
var _ = require('underscore');
var Backbone = require('backbone');


/*
 * ColorOption : Private View
 */

var ColorOption = Backbone.View.extend();

ColorOption.prototype.tagName = 'mei-stone';


/* Bind select event */

ColorOption.prototype.events = {
  'mousedown': 'select'
};

/* Listen to form change event */

ColorOption.prototype.initialize = function (opts) {
  _.bindAll(this, 'render', 'select');
  this.color = opts.color;
  this.form = opts.form;
  this.form.on('change', this.render);
  this.$el
    .addClass(this.color)
    .append($('<span>').addClass('shadow'))
    .append($('<span>').addClass('light'))
};

/* Update form on select */

ColorOption.prototype.select = function () {
  this.form.set('color', this.color);
};

/* Set element as selected if color of form is current */

ColorOption.prototype.render = function () {
  if (this.form.get('color') === this.color) {
    this.$el.addClass('selected');
  } else {
    this.$el.removeClass('selected');
  }
  return this;
};

/*
 * ColorChoiceView
 */

var ColorChoiceView = module.exports = Backbone.View.extend();

ColorChoiceView.prototype.tagName = 'mei-color-choice';


/* Instanciate the 3 options, forwarding the form model */

ColorChoiceView.prototype.initialize = function () {
  _.bindAll(this, 'render');
  this.model.on('change', this.render);
  this.$el
    .append(new ColorOption({color: 'black', form: this.model}).render().el)
    .append(new ColorOption({color: 'white', form: this.model}).render().el)
};
