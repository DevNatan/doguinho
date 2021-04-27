"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Injectable = Injectable;
exports.Inject = Inject;
exports.DefaultInjectionScope = void 0;
var DefaultInjectionScope = "Singleton";
exports.DefaultInjectionScope = DefaultInjectionScope;

function Injectable() {
  return function () {};
}

function Inject() {
  return function () {};
}