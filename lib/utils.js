'use strict';
var utils = {};

utils.rawify = function (test, fn) {
  var oldRaw = this.options.raw;
  if (test) {
    this.options.raw = true;
  }
  fn();
  if (test) {
    this.options.raw = oldRaw;
  }
};

module.exports = utils;

