import { Module } from "./module";
import { Constructor } from "./utils";
import { RouterOptions } from "vue-router";
import { Store } from "vuex";
import { Container, interfaces } from "inversify";
import loader from "./loader";
export { Container };
export type ContainerOptions = interfaces.ContainerOptions;

export type DoguinhoModules = Constructor<Module>[];

export type DoguinhoAutoRegister = {
    path?: string;
    pattern?: RegExp;
};

export type DoguinhoOptions<S = any> = {
    autoRegister?: true | DoguinhoAutoRegister;
    modules?: DoguinhoModules;
    containerOptions?: ContainerOptions;
    routerOptions?: RouterOptions
    store?: Store<S>
};

export interface Doguinho {
    readonly container: Container
}

export function createDoguinho(options?: DoguinhoOptions): Doguinho {
    return loader(options);
}