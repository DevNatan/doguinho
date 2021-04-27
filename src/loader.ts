import { Module, ModuleCache, ModuleConstructor, ModuleContext, ModuleRegistry } from "./module";
import {
    Constructor,
    ContainerOptions, decorate,
    Doguinho,
    DoguinhoOptions,
    fixModuleName, Injectable, InjectionScope,
    Injector, InjectorCache, ProviderKey, ProviderMetadata
} from "./index";
import { Container } from "inversify";

type InitContext = { cache: ModuleCache, injector: Injector }

function autoLoadModules(init: InitContext, path: string, pattern: RegExp) {
    console.log(`[dog] loading modules (path = ${path}, pattern = ${pattern})`);
    const ctx = require.context(path, true, pattern, "sync");
    console.log(`[dog] ctx`, ctx.keys());
    const files = ctx.keys().map((name: string) => {
        console.log("[dog] [module]", name);
        return { name, module: new (ctx(name).default)() };
    });

    console.log("[dog] files", files);
    for (const { name, module } of files) {
        if (!(module instanceof Module))
            throw new Error(`Default export of ${name} must extend Module`);
    }

    const modules = files.map((value) => value.module);
    for (const module of modules)
        loadModule(init, module);

    console.log("[dog] loading modules:", modules);
}

function loadModule(ctx: InitContext, constructor: ModuleConstructor) {
    const name = fixModuleName(constructor.name);
    if (ctx.cache[name])
        throw new Error(`Module ${name} already loaded`)

    const module = new constructor();
    defineProperty(module, "moduleName", name);
    console.log("[dog] [module] load:", name);

    initModule(ctx, module);
}

function initModule(ctx: InitContext, module: Module): void {
    for (const service of module.providers())
        ctx.injector.inject(service)

    module.init(ctx.injector)
    console.log("[dog] [module] init:", module.moduleName);
}

function defineProperty(target: any, prop: PropertyKey, value: any): void {
    Object.defineProperty(target, prop, {
        value,
        writable: false,
        enumerable: true,
        configurable: true
    });
}

function providerName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function providerId(name: string, key?: ProviderKey): ProviderKey {
    return key || Symbol(name);
}

function providerMetadata<T>(name: string, key?: ProviderKey): ProviderMetadata {
    name = providerName(name);
    return { name, key: providerId(name, key) };
}

function retrieveMetadata(cache: InjectorCache, value: Constructor): ProviderKey {
    return cache[providerName(value.name)]
}

function buildInjector(cache: InjectorCache, container: Container): Injector {
    return {
        get<T>(value: Constructor<T>): T {
            return container.get(retrieveMetadata(cache, value));
        },
        inject<T>(value: Constructor<T>, scope?: InjectionScope, key0?: ProviderKey): void {
            const {name, key } = providerMetadata(value.name, key0);
            decorate(Injectable(), value);
            cache[name] = key;

            switch (scope) {
                case "Transient": {
                    container.bind(key).to(value).inTransientScope();
                    break
                }
                case "Request": {
                    container.bind(key).to(value).inRequestScope();
                    break;
                }
                default: container.bind(key).to(value).inSingletonScope();
            }
        },
        injectAll(...values: Constructor[]) {
            for (const value of values)
                this.inject(value);
        },
        injectAllScoped(scope?: InjectionScope, ...values) {
            for (const value of values)
                this.inject(value, scope);
        }
    }
}

export default (options?: DoguinhoOptions): Doguinho => {
    let containerOptions: ContainerOptions = {
        autoBindInjectable: false,
        skipBaseClassChecks: true,
        defaultScope: "Singleton",
    };

    console.log("[dog]", options, containerOptions);
    if (options && options.containerOptions)
        containerOptions = Object.assign(
            containerOptions,
            options.containerOptions
        );

    const container = new Container(containerOptions);
    const cache: ModuleCache = {};
    const injector = buildInjector({}, container);
    const init = { cache, injector };

    if (options) {
        if (options.autoRegister) {
            const autoRegister = options.autoRegister as any;
            console.log("[dog] auto register options", autoRegister);
            autoLoadModules(init,
                autoRegister.path || ".",
                autoRegister.pattern || /^.*\.module.(ts|js)$/m
            );
        }

        if (options.modules) {
            for (const module of options.modules)
                loadModule(init, module)
        }
    }

    const registry = {
        get(name: string): Module {
            return cache[name]
        },
        has(name: string): boolean {
            return typeof cache[name] !== "undefined";
        }
    };

    console.log("[dog] started");
    return {
        container,
        injector,
        registry
    };
}