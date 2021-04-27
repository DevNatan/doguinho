import { Injector, Providers } from "./injector";
import { Constructor } from "./utils";

export type ModuleConstructor = Constructor<Module>

export interface ModuleContext extends Injector {
}

export class Module {
  readonly moduleName!: string;
  init(context: ModuleContext): void {}
  providers(): Providers {
    return [];
  }
}

export type ModuleCache = { [key: string]: Module };

export interface ModuleRegistry {
  get(name: string): Module | undefined;
  has(name: string): boolean;
}

class ProvA {}
class ProvB {}

class Test extends Module {
  providers(): Providers {
    const value = "a";
    return [ProvA, ProvB];
  }
}