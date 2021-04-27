import { Injector, Providers } from "./injector";
import { Constructor } from "./utils";

export type ModuleConstructor = Constructor<DoguinhoModule>

export interface ModuleContext extends Injector {
  readonly module: DoguinhoModule
}

export interface ModuleOptions {
  providers?: Providers
}

export const ModuleMetadataKey = Symbol("doguinho:module");

export function Module(options?: ModuleOptions) {
  return (target: Function) => {
    Reflect.defineMetadata(ModuleMetadataKey, options, target.prototype);
  }
}

export class DoguinhoModule {
  readonly name!: string;
  readonly qualifiedName!: string;

  beforeInit(context: ModuleContext): void {}
  init(context: ModuleContext): void {}
}

export type ModuleCache = { [key: string]: DoguinhoModule };

export interface ModuleRegistry {
  get(name: string): DoguinhoModule | undefined;
  has(name: string): boolean;
}