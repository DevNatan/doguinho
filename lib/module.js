"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Module = Module;
exports.DoguinhoModule = exports.ModuleMetadataKey = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModuleMetadataKey = "doguinho:module";
exports.ModuleMetadataKey = ModuleMetadataKey;

function Module(options) {
  return function (target) {
    Reflect.defineMetadata(ModuleMetadataKey, options, target);
  };
}

var DoguinhoModule = function DoguinhoModule() {
  _classCallCheck(this, DoguinhoModule);
};

exports.DoguinhoModule = DoguinhoModule;