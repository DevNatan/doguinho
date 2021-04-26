# doguinho
IoC and DI for Vue with InversifyJS inspired by NestJS

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

## Basic usage
### Bindings
Inject any type of instantiable class in the context of the module.\
Anything injected becomes *singleton* in the module context.

When necessary, InversifyJS will instantiate the object and keep it available for other services.

```ts
@Injectable() 
export class DogService {}
```
```
doguinho.bind(DogService);
```

Inject other services available in the module into your service constructor.
```ts
@Injectable() 
export class CatsService {

  constructor(@Inject() private readonly dogsService: DogsService) {}

}
```
```
doguinho.bind(DogsService, CatsService);
```

### Lazy Injection
It is often not possible for InversifyJS to instantiate the object being injected, for example: Vue components or Vuex stores.\
Considering that there is no specific order of startup and that we do not know what will or will not be available or when, we created the lazy injection.

Make a note of a property so that it becomes a getter which, when requested, will get the result late.

```
export class Somewhere {

  @LazyInject() private readonly dogsService!: DogsService
  
}
```

#### Using with `vuex-module-decorators`
```ts
export interface Dog { name: string, age: number };

@Module
export default class DogStore extends VuexModule {

  // will be automatically injected when requested
  @LazyInject() private readonly dogsService!: DogsService;
  private dogs: Dog[] = [];
  
  @Action
  public async createDog(name: string): Promise<Dog> {
    return await this.dogsService.then((dog: Dog) => this.dogs.push(dog));
  }

}
```

You can inject the store so that it will be available anywhere in the scope of that module.
```ts
doguinho.bind(DogStore);
```

#### Using with `vue-class-component`
```ts
@Component<SomeComponent>({
  created(): void {
    this.dogStore.createDog("Viralata Caramelo").then((dog: Dog) => {
      console.log("Dog created", dog);
    });
  }
})
export default class SomeComponent extends Vue {

  // lazy injectins are evaluated when requested and transformed into getters
  @LazyInject() private readonly dogStore!: DogStore;

}
```
