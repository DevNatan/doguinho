import { Constructor } from "./utils";
import { interfaces } from "inversify";
export interface Injector {
    get<T>(value: Constructor<T>): T;
    inject<T>(value: Constructor<T>, key?: ProviderKey): void;
    injectScoped<T>(value: Constructor<T>, scope?: InjectionScope, key?: ProviderKey): void;
    injectConstant<T>(value: T, key: ProviderKey): void;
    injectAll(...values: Constructor[]): void;
    injectAllScoped(scope?: InjectionScope, ...values: Constructor[]): void;
}
export declare type InjectorCache = {
    [name: string]: ProviderKey;
};
export declare type InjectionScope = interfaces.BindingScope;
export declare const DefaultInjectionScope: InjectionScope;
export declare function Injectable(): ClassDecorator;
export declare function Inject(): PropertyDecorator & ParameterDecorator;
export declare type ProviderKey = string | symbol;
export declare type ProviderMetadata = {
    name: string;
    key: ProviderKey;
};
export declare type Providers = Constructor[];
