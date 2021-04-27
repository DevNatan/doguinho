import { Container, ContainerOptions, DoguinhoOptions } from "./app";
import { Module } from "./module";

function loadModules(path: string, pattern: RegExp) {
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
    console.log("[dog] loading modules:", modules);
}


export default (options?: DoguinhoOptions) => {
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
    if (options && options.autoRegister) {
        const autoRegister = options.autoRegister as any;
        console.log("[dog] auto register options", autoRegister);
        loadModules(
            autoRegister.path || ".",
            autoRegister.pattern || /^.*\.module.(ts|js)$/m
        );
    }

    console.log("[dog] started");
    return {container};
}