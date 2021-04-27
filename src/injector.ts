import { Constructor } from "./utils";

export declare const Injectable: ClassDecorator;
export declare function Inject(): PropertyDecorator
export declare function LazyInject(): PropertyDecorator

export interface InjectorContext {
  inject<T>(value: Constructor<T>): void;
  inject(...value: Constructor[]): void;
}
