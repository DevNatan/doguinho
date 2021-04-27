import { Injector, Providers } from "./injector";

export interface ModuleContext extends Injector {
  readonly module: DoguinhoModule
}

export interface ModuleOptions {
  providers?: Providers,
  beforeInit?(context: ModuleContext): void,
  init?(context: ModuleContext): void
}

export const ModuleMetadataKey = "doguinho:module";

export function Module(options?: ModuleOptions): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(ModuleMetadataKey, options, target);
  }
}

export class DoguinhoModule {
  readonly name!: string;
  readonly qualifiedName!: string;
  readonly options!: ModuleOptions;
}

export type ModuleCache = { [key: string]: ModuleContext };

export interface ModuleRegistry {
  get(name: string): DoguinhoModule | undefined;
  has(name: string): boolean;
}