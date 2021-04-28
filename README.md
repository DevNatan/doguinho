# doguinho
IoC and DI for Vue with InversifyJS inspired by NestJS

[![License](https://img.shields.io/npm/l/doguinho)](https://github.com/DevNatan/doguinho/blob/main/LICENSE)
[![Node.js Package](https://github.com/DevNatan/doguinho/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/DevNatan/doguinho/actions/workflows/npm-publish.yml)
[![NPM version](https://img.shields.io/npm/v/doguinho)](https://www.npmjs.com/package/doguinho)

## Requirements
* Vue 2.x
* [reflect-metadata](https://github.com/rbuckton/reflect-metadata)
* [InversifyJS](https://github.com/inversify/InversifyJS)

## Features
* [vuex-module-decorators](https://github.com/championswimmer/vuex-module-decorators) support using lazy injection via `@LazyInject`.
* Services are accessible through Vue components.
* Can inject a `VuexStore` if you want type-safety.

## Installation
```
$ npm install doguinho reflect-metadata inversify --save
```

## TypeScript Configuration
```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

## Getting started
## Creating application

First, create an Doguinho instance.
```ts
import { createDoguinho } from "doguinho";

const doguinho = createDoguinho(options);
```

You can pass [several options](https://github.com/DevNatan/doguinho/blob/3f9c44140e5661a7b80803079f17c64513d7ed05/types/index.d.ts#L15) during creation such as `router` and` store` if you want to 
define 
them in advance, and Doguinho will use them as the basis for defining things, if you do not provide, Doguinho will create its own.

#### Add it to your Vue application
```ts
import Vue from "vue";
const vm = new Vue({ doguinho });
```

> Note: you must create Doguinho before building your application.

## Modules
Modules are closed injection environments and should be used to better organize your application.

To define a new module simply add the decorator `@Module` on it.

```ts
import { Module } from "doguinho";

@Module()
export default class MyModule {}
```

### Initialization handler
In case you need to do something when the module starts, there are initialization handlers 
`beforeInit` and `init` for you to work on.

```ts
import { Module, ModuleContext } from "doguinho";

@Module({
    onInit(context: ModuleContext): void { /* ... */ }
})
export default class MyModule {}
```

You can use the current context to perform manual injection, or anything else.
```ts
import { Module, ModuleContext } from "doguinho";

@Module({
    beforeInit(context: ModuleContext): void {
        context.inject(Anything);
    }
})
export default class MyModule {}
```

#### Use keys to inject constant, dynamic, or function values.
```ts
const HelloWorldKey = "hero";

@Module({
    beforeInit(context: ModuleContext): void {
        context.injectConst("Hello world", HelloWorldKey);
    }
})
export default class MyModule {}
```

#### Get values injected into the post-init handler.
```ts
const InitKey = "hero";

@Module({
    beforeInit(context: ModuleContext): void {
        context.injectConstant(`Module "${context.module.name}" initialized!`, InitKey);
    }, 
    init(context: ModuleContext): void {
        console.log(context.get(InitKey));
        // prints: Module "auth" initialized
    }
})
export default class AuthModule {}
```

### Providers
Providers passed through modules are automatically injected in the context of that module.

> Only classes annotated with `@Injectable` can be providers.

```ts
import { Module, Injectable } from "doguinho";

@Injectable()
export class SomeRandomService {}

@Module({
    providers: [SomeRandomService]
})
export default class MyModule {}
```

### Recommended project directory structure
A recommended project structure using modules is the `feature module` which consists of a
directory (with its own module) for each feature. Something like this:

**Source directory (/src)**
```
├─ app/
│  │  ├─ module-A/
│  │  │  ├─ A.module.ts
│  │  ├─ module-B/
│  │  │  ├─ B.module.ts
│  │  app.module
│  │  App.vue
│  ├─ main.ts

```

## Injection
Inject any type of instantiable class in the context of the module.\
Anything injected becomes *singleton* in the module context.

When necessary, InversifyJS will instantiate the object and keep it available for other services.

```ts
@Injectable 
export class DogService {}
```
```
doguinho.inject(DogService);
```

Inject other services available in the module into your service constructor.
```ts
@Injectable 
export class CatsService {

  constructor(@Inject() private readonly dogsService: DogsService) {}

}
```
```
doguinho.inject(DogsService, CatsService);
```

It is often not possible for InversifyJS to instantiate the object being injected, for example: Vue components or Vuex stores.

Considering that there is no specific order of startup and that we do not know what will or will not be available or when, we created the lazy injection.

### Lazy Injection
Make a note of a property so that it becomes a getter which, when requested, will get the result late.

```
export class Somewhere {

  @Inject() private readonly dogsService!: DogsService
  
}
```

> Note: providers are searched for in their own module and then in the global context if they are not found.

### Using with `vuex-module-decorators`
```ts
@Module
export default class DogsStore extends VuexModule {

  @Inject() private readonly dogsService!: DogsService;
  
  @Action
  public async createDog(name: string): Promise<Dog> {
      // do something with DogsService
  }

}
```

You can inject the store so that it will be available anywhere in the scope of that module.
```ts
doguinho.inject(DogStore);
```

### Using with `vue-class-component`
```ts
@Component
export default class SomeComponent extends Vue {

  @Inject() private readonly dogsStore!: DogsStore;
  
  /* ... do something wih DogsStore */

}
```