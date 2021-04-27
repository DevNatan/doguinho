import { Injector, Providers } from "./injector";
export interface ModuleContext extends Injector {
    readonly module: DoguinhoModule;
}
export interface ModuleOptions {
    providers?: Providers;
    beforeInit?(context: ModuleContext): void;
    init?(context: ModuleContext): void;
}
export declare const ModuleMetadataKey = "doguinho:module";
export declare function Module(options?: ModuleOptions): ClassDecorator;
export declare class DoguinhoModule {
    readonly name: string;
    readonly qualifiedName: string;
    readonly options: ModuleOptions;
}
export declare type ModuleCache = {
    [key: string]: ModuleContext;
};
export interface ModuleRegistry {
    get(name: string): DoguinhoModule | undefined;
    has(name: string): boolean;
}
