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

export type InjectorCache = { [name: string]: ProviderKey };

export type InjectionScope = interfaces.BindingScope;
export const DefaultInjectionScope: InjectionScope = "Singleton";

export function Injectable(): ClassDecorator {
  return (): void => {};
}

export function Inject(): PropertyDecorator & ParameterDecorator {
  return (): void => {};
}

export type ProviderKey = string | symbol
export type ProviderMetadata = { name: string, key: ProviderKey };
export type Providers = Constructor[];