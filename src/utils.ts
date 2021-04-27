import { decorate as inversifyDecorate } from "inversify";

export type Decorator = ClassDecorator | ParameterDecorator | MethodDecorator;
export type Constructor<T = any> = { new (...args: any[]): T };
export type Instantiable<T> = new (...args: any[]) => T;

export function decorate(decorator: Decorator, constructor: Constructor): void {
    inversifyDecorate(decorator, constructor);
}

export function fixModuleName(name: string): string {
    const suffix = name.indexOf("Module");
    if (suffix !== -1)
        name = name.substr(0, suffix);

    return name.toLowerCase();
}