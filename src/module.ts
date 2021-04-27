import { InjectorContext } from "./injector";

export interface ModuleContext extends InjectorContext {}

export declare class Module {
  readonly moduleName: string;
  init(context: ModuleContext): void
}
