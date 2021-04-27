import { Injector, Providers } from "./injector";
import { Constructor } from "./utils";
export declare type ModuleConstructor = Constructor<DoguinhoModule>;
export interface ModuleContext extends Injector {
    readonly module: DoguinhoModule;
}
export interface ModuleOptions {
    providers?: Providers;
}
export declare const ModuleMetadataKey: unique symbol;
export declare function Module(options?: ModuleOptions): (target: Function) => void;
export declare class DoguinhoModule {
    readonly name: string;
    readonly qualifiedName: string;
    beforeInit(context: ModuleContext): void;
    init(context: ModuleContext): void;
}
export declare type ModuleCache = {
    [key: string]: DoguinhoModule;
};
export interface ModuleRegistry {
    get(name: string): DoguinhoModule | undefined;
    has(name: string): boolean;
}
