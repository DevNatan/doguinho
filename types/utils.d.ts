export declare type Decorator = ClassDecorator | ParameterDecorator | MethodDecorator;
export declare type Constructor<T = any> = {
    new (...args: any[]): T;
};
export declare type Instantiable<T> = new (...args: any[]) => T;
export declare function decorate(decorator: Decorator, constructor: Constructor): void;
export declare function fixModuleName(name: string): string;
export declare function assignFn<T = {
    [key: string]: Function;
}>(current: string, expect: T): void;
