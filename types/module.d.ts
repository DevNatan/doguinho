import { Injector, Providers } from "./injector";
import { Constructor } from "./utils";
export declare type ModuleConstructor = Constructor<Module>;
export interface ModuleContext extends Injector {
}
export declare class Module {
    readonly moduleName: string;
    init(context: ModuleContext): void;
    providers(): Providers;
}
export declare type ModuleCache = {
    [key: string]: Module;
};
export interface ModuleRegistry {
    get(name: string): Module | undefined;
    has(name: string): boolean;
}
