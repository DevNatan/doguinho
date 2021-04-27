import { Constructor } from "./utils";
import { interfaces } from "inversify";

export function Injectable(): ClassDecorator {
  return (target: Function) => {

  }
}
export declare function Inject(): PropertyDecorator
export declare function LazyInject(): PropertyDecorator

export interface Injector {
  get<T>(value: Constructor<T>): T;
  inject<T>(value: Constructor<T>, scope?: InjectionScope, key?: ProviderKey): void;
  injectAll(...values: Constructor[]): void;
  injectAllScoped(scope?: InjectionScope, ...values: Constructor[]): void;
}

export type InjectionScope = interfaces.BindingScope;

export type InjectorCache = { [name: string]: ProviderKey };

export type ProviderKey = string | symbol
export type ProviderMetadata = { name: string, key: ProviderKey };

export type Providers = Constructor[];