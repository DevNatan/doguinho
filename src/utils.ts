export type Decorator = ClassDecorator | ParameterDecorator | MethodDecorator;
export type Constructor<T = any> = { new (...args: any[]): T };
export type Instantiable<T> = new (...args: any[]) => T;

export declare function decorate(decorator: Decorator, constructor: Constructor): void
