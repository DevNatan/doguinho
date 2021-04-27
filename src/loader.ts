import {
    DoguinhoModule,
    ModuleCache,
    ModuleContext,
    ModuleMetadataKey, ModuleOptions,
} from "./module";
import {
    assignFn,
    Constructor,
    ContainerOptions, decorate, DefaultInjectionScope,
    Doguinho,
    DoguinhoOptions,
    fixModuleName, Injectable, InjectionScope,
    Injector, InjectorCache, ProviderKey, ProviderMetadata
} from "./index";
import { Container } from "inversify";

type InitContext = { cache: ModuleCache, injector: Injector }

function autoLoadModules(init: InitContext, path: string, pattern: RegExp) {
    console.log(`[dog] [auto load] @ \"${path}\"...`);
    const ctx = require.context(path, true, pattern, "sync");
    const files = ctx.keys().map((name: string) => {
        return { name, module: new (ctx(name).default)() };
    });

    for (const { name, module } of files) {
        if (!(module instanceof DoguinhoModule))
            throw new Error(`Default export of ${name} must extend Module`);
    }

    const modules = files.map((value) => value.module);
    for (const module of modules)
        loadModule(init, module);
}

function loadModule(ctx: InitContext, constructor: Constructor) {
    const cname = constructor.name;
    console.log("[dog] [module] loading", cname);

    const name = fixModuleName(cname);
    if (ctx.cache[name])
        throw new Error(`Module ${name} already loaded`)

    if (!Reflect.hasOwnMetadata(ModuleMetadataKey, constructor))
        throw new Error(`${cname} is not a Module (no @Module decorator found)`)

    const module = new constructor();
    defineProperty(module, "name", name);
    defineProperty(module, "qualifiedName", cname);

    const moduleCtx: ModuleContext = Object.assign({ module }, ctx.injector);
    const options: ModuleOptions | undefined = Reflect.getMetadata(ModuleMetadataKey, constructor);

    if (options && options.beforeInit)
        options.beforeInit(moduleCtx);

    defineProperty(module, "options", options || {});
    initModule(ctx, moduleCtx, options, module);
}

function initModule(
    initContext: InitContext,
    moduleContext: ModuleContext,
    moduleOptions: ModuleOptions | undefined,
    module: DoguinhoModule
): void {
    if (moduleOptions && moduleOptions.providers) {
        for (const service of moduleOptions.providers)
            initContext.injector.inject(service)
    }

    initContext.cache[module.name] = moduleContext;
    console.log("[dog] [module] ready", module.qualifiedName);
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

function providerMetadata<T>(name?: string, key?: ProviderKey): ProviderMetadata {
    if (typeof name === "undefined") {
        if (typeof key === "undefined")
            throw new Error("Cannot create provider metadata (name and key is null)");

        let name;
        if (typeof key == "symbol")
            name = key.description;

        return { name: name || key.toString(), key };
    }

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
        inject<T>(value: Constructor<T>, scope?: InjectionScope, key?: ProviderKey): void {
            this.injectScoped(value, DefaultInjectionScope, key);
        },
        injectScoped<T>(value: Constructor<T>, scope?: InjectionScope, key0?: ProviderKey): void {
            const { name, key } = providerMetadata(value.name, key0);
            decorate(Injectable(), value);
            cache[name] = key;

            if (scope) {
                assignFn(scope, {
                    "Transient": container.bind(key).to(value).inTransientScope(),
                    "Request": container.bind(key).to(value).inRequestScope(),
                    "default": container.bind(key).to(value).inSingletonScope()
                })
            }
        },
        injectConstant<T>(value: T, key: ProviderKey): void {
            const metadata = providerMetadata(undefined, key);
            cache[metadata.name] = metadata.key;
            container.bind(key).toConstantValue(value);
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
    console.log("[dog] starting...");
    let containerOptions: ContainerOptions = {
        autoBindInjectable: false,
        skipBaseClassChecks: true,
        defaultScope: DefaultInjectionScope,
    };

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
            autoLoadModules(init,
                autoRegister.path || ".",
                autoRegister.pattern || /^.*\.module.(ts|js)$/m
            );
        }

        if (options.modules) {
            console.log("[dog] loading defined modules...");
            for (const module of options.modules)
                loadModule(init, module)
        }
    }

    for (const name in cache) {
        if (!cache.hasOwnProperty(name))
            continue;

        const ctx = cache[name];
        ctx.module.options.init?.(ctx);
    }

    const registry = {
        get(name: string): DoguinhoModule {
            return cache[name]?.module
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