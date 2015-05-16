/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var Interval = require('interval-arithmetic');
module.exports = {
  disableRounding: function () {
    Interval.rmath.disable();
  },

  enableRounding: function () {
    Interval.rmath.enable();
  }
};
