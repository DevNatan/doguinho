import { Constructor } from "./utils";
import { interfaces } from "inversify";
export declare function Injectable(): ClassDecorator;
export declare function Inject(): PropertyDecorator;
export declare function LazyInject(): PropertyDecorator;
export interface Injector {
    get<T>(value: Constructor<T>): T;
    inject<T>(value: Constructor<T>, scope?: InjectionScope, key?: ProviderKey): void;
    injectAll(...values: Constructor[]): void;
    injectAllScoped(scope?: InjectionScope, ...values: Constructor[]): void;
}
export declare type InjectionScope = interfaces.BindingScope;
export declare type InjectorCache = {
    [name: string]: ProviderKey;
};
export declare type ProviderKey = string | symbol;
export declare type ProviderMetadata = {
    name: string;
    key: ProviderKey;
};
export declare type Providers = Constructor[];
