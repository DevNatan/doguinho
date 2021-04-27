"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decorate = decorate;
exports.fixModuleName = fixModuleName;
exports.assignFn = assignFn;

var _inversify = require("inversify");

function decorate(decorator, constructor) {
  (0, _inversify.decorate)(decorator, constructor);
}

function fixModuleName(name) {
  var suffix = name.indexOf("Module");
  if (suffix !== -1) name = name.substr(0, suffix);
  return name.toLowerCase();
}

function assignFn(current, expect) {
  (expect[current] || expect["default"] || function () {})();
}