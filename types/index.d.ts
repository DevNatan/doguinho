import "reflect-metadata";
import { RouterOptions } from "vue-router";
import { Store } from "vuex";
import { Container, interfaces } from "inversify";
import { ModuleRegistry } from "./module";
import { Injector } from "./injector";
import { Constructor } from "./utils";
export * from "./injector";
export * from "./module";
export * from "./plugin";
export * from "./utils";
export declare type ContainerOptions = interfaces.ContainerOptions;
export declare type DoguinhoAutoRegister = {
    path?: string;
    pattern?: RegExp;
};
export declare type DoguinhoOptions<S = any> = {
    autoRegister?: true | DoguinhoAutoRegister;
    modules?: Constructor[];
    containerOptions?: ContainerOptions;
    routerOptions?: RouterOptions;
    store?: Store<S>;
};
export interface Doguinho {
    readonly container: Container;
    readonly registry: ModuleRegistry;
    readonly injector: Injector;
}
export declare function createDoguinho(options?: DoguinhoOptions): Doguinho;
