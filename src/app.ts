import { Module } from "./module";
import { Constructor } from "./utils";

export declare type Container = {};
export declare type ContainerOptions = {}
export type DoguinhoModules = Constructor<Module>[];

export type DoguinhoAutoRegister = {
  path?: string;
  pattern?: RegExp;
};

export type DoguinhoOptions = {
  autoRegister?: true | DoguinhoAutoRegister;
  modules?: DoguinhoModules;
  containerOptions?: ContainerOptions;
};

export interface Doguinho {
  readonly container: Container;
}

export declare function createDoguinho(options?: DoguinhoOptions): Doguinho