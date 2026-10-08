# Angular Testing Notes

Jasmine writes the test and Karma runs it in a browser. But there's a third player: **Angular
itself**. Angular components don't exist in a vacuum — they need dependency injection, change
detection, and a DOM to render into. This page covers the Angular pieces that make that work
in tests, and the Angular *app* features the tests exercise.

There are really two different things here, and it helps to keep them separate:

1. **Angular testing APIs** — the tools Angular gives you to *set up* a test
   (`TestBed`, `ComponentFixture`, the HTTP mock).
2. **Angular app APIs under test** — the modern Angular features your *components* use
   (signals, outputs, lifecycle hooks) that the tests poke at.

---

## Part 1 — The testing APIs

### `TestBed` — the "test workbench"

`TestBed` is Angular's way of building a mini-application just for a test. Instead of
starting the whole app, you tell `TestBed` what to assemble, and it hands you a working
component with all its dependencies wired up.

```ts
await TestBed.configureTestingModule({
  imports: [Search],                                  // the component to build
  providers: [{ provide: PokeService, useValue: mockPokeService }]  // fake its dependency
}).compileComponents();
```

Two options you'll see constantly:

- **`imports`** — the thing under test. Because this app uses **standalone components**
  (no `NgModule`), you import the component directly. This is the modern Angular style.
- **`providers`** — how you *fake dependencies*. `{ provide: PokeService, useValue: mock }`
  says "whenever anything asks for `PokeService`, give it this mock instead of the real
  one." This is the heart of isolated testing — the component thinks it has a real service,
  but it's actually talking to a controlled fake.

### `TestBed.createComponent` → `ComponentFixture`

Once the module is configured, you ask `TestBed` to actually build the component. What you
get back is a **`ComponentFixture`** — a handle that lets you reach into the component and
its rendered DOM.

```ts
fixture = TestBed.createComponent(Search);
component = fixture.componentInstance;   // the component's TypeScript object
fixture.detectChanges();                 // tell Angular to render/update the view
```

The three things you'll grab off a fixture:

| Fixture member | What it is |
|----------------|-----------|
| `componentInstance` | The component's JS object — read/write its properties, call its methods |
| `nativeElement` | The rendered DOM — query it to check what's on screen |
| `detectChanges()` | Manually trigger Angular's change detection to update the view |

### `detectChanges()` — the manual "render now" button

In a real app, Angular decides when to update the screen. In a test, **you** decide, by
calling `fixture.detectChanges()`. This is why you see it everywhere:

```ts
mockPokeService.subject.next(pokemonFixture);  // push new data
fixture.detectChanges();                        // re-render with that data
```

Call it after you change something, and the DOM reflects the change. This is what makes the
tests deterministic — nothing updates until *you* say so.

### `TestBed.inject` — pull a service out of the workbench

Sometimes you don't want a component — you want the service itself, or a mock you registered.
`TestBed.inject` reaches into the test's dependency-injection container and hands it to you:

```ts
service = TestBed.inject(PokeService);
httpMock = TestBed.inject(HttpTestingController);
```

### `TestBed.runInInjectionContext` — run a function "inside" Angular

Some code needs Angular's dependency injection to resolve its dependencies, but isn't a
component. A **route guard** is exactly that. The guard spec wraps the guard call so it can
resolve `User` and `Router` from the test's providers:

```ts
const executeGuard: CanActivateFn = (...guardParameters) =>
  TestBed.runInInjectionContext(() => authenticationGuard(...guardParameters));
```

Think of it as: "run this function as if it were inside an Angular component, so `inject()`
works."

### `RouterTestingModule` — a fake router

The root `app.spec.ts` imports `RouterTestingModule` to give the app a working (but fake)
router for rendering. It's a lightweight stand-in so components that use routing don't need
a real server or real navigation.

### Testing HTTP calls — `HttpTestingController`

The `PokeService` spec tests real HTTP behavior *without* a network. Angular provides a
mock HTTP backend:

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()]
});
```

- `provideHttpClient()` — the modern way to enable HTTP in a test.
- `provideHttpClientTesting()` — swap in a fake backend that intercepts requests.

Then you inject `HttpTestingController` and use it to *intercept* and *answer* requests:

```ts
service.searchPokemon('pikachu');
const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
expect(req.request.method).toBe('GET');   // check it was a GET to the right URL
req.flush(rawPikachu);                    // answer it with fake data, synchronously
```

And in `afterEach`, `httpMock.verify()` asserts **no request was left unanswered** — a
safety net that catches accidental real network calls.

> This is the "synchronous determinism" the Jasmine notes hinted at: the HTTP mock answers
> instantly with `flush`, so there's nothing to wait for — no timers, no `fakeAsync`, no
> `done()`. The test just runs top to bottom.

---

## Part 2 — The Angular app features under test

The specs don't just use Angular's testing tools — they exercise the *modern Angular* your
components are written in. Knowing these helps you read what the tests are actually checking.

### Signals — reactive state

Many components store state in **signals** (the modern replacement for plain properties).
A signal is a value you read with `()` and update with `.set()`:

```ts
expect(component.pokemonName()).toBe('pikachu');   // read a signal
component.typesArray.set(['fire', 'water']);       // update a signal
```

The tests read signals directly to check state, and call `detectChanges()` to confirm the
view re-rendered from them. The `pokename` spec even *injects* a fresh signal to control
the starting state:

```ts
component.typesArray = signal<string[]>([]);
```

### `@Output` / `OutputEmitterRef` — child talks to parent

Components can emit events upward. The `poke-type` spec spies on the output to verify it
fires and check what it carries:

```ts
spyOn(component.colorReceived, 'emit');
// ...
expect(component.colorReceived.emit).toHaveBeenCalled();
const emitted = (component.colorReceived.emit as jasmine.Spy).calls.mostRecent().args[0];
```

And the parent (`home`) consumes it via a handler method:

```ts
component.onColorReceived(['red', 'blue']);
expect(component.typesArray()).toEqual(['red', 'blue']);
```

### `@Input` + `ngOnChanges` — reacting to input changes

The `Type` directive reacts when its `@Input` changes. The spec drives the lifecycle hook
*by hand*, building a fake `SimpleChanges` object to simulate "the input changed":

```ts
const changes: SimpleChanges = {
  type: { currentValue: type, previousValue: undefined, firstChange: true, isFirstChange: () => true }
};
directive.ngOnChanges(changes);
```

This is a nice example of testing a lifecycle hook directly instead of through the DOM.

### `ElementRef` + `Renderer2` — touching the DOM safely

The `Type` directive colors text using Angular's `Renderer2` (a safe way to touch the DOM).
The spec fakes both dependencies and checks the renderer was told the right thing:

```ts
element = new ElementRef(document.createElement('div'));
renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['setStyle']);
directive = new Type(element, renderer);
// ...
expect(renderer.setStyle).toHaveBeenCalledWith(element.nativeElement, 'color', '#EE8130');
```

### `BehaviorSubject` — the mock service's engine

The shared mock `PokeService` is backed by a **`BehaviorSubject`** — an RxJS value that
(1) always has a current value and (2) lets tests push new values that components react to:

```ts
mockPokeService.subject.next(pokemonFixture2);   // push new pokemon
fixture.detectChanges();                          // component re-renders
```

This is why component tests can verify "the component updates when new data arrives" so
cleanly — the mock is a live stream the test controls.

### DOM assertions — checking what's actually on screen

Because tests run in a real browser, they can query the rendered DOM directly:

```ts
const h2 = fixture.nativeElement.querySelector('h2.pokemon-name');
expect(h2.textContent).toBe('Pikachu');
```

And even simulate real user interaction:

```ts
input.value = 'charizard';
input.dispatchEvent(new Event('input'));   // type into the box
button.click();                            // click the button
expect(mockPokeService.searchPokemon).toHaveBeenCalledWith('charizard');
```

---

## Putting it together

A typical component test reads like this, and now every line should make sense:

```ts
beforeEach(async () => {
  mockPokeService = createMockPokeService();                    // build the fake service
  await TestBed.configureTestingModule({                        // assemble the workbench
    imports: [PokeMoves],                                        //   the component
    providers: [{ provide: PokeService, useValue: mockPokeService }]  //   fake its dep
  }).compileComponents();
  fixture = TestBed.createComponent(PokeMoves);                  // build the component
  component = fixture.componentInstance;                         // reach its object
  fixture.detectChanges();                                       // render it
});
```

**The one (run-on) sentence summary:** `TestBed` assembles a component with faked dependencies,
`ComponentFixture` gives you a handle to its object and its rendered DOM, `detectChanges()`
controls when the view updates, and the HTTP mock / `BehaviorSubject` mock keep everything
fast and deterministic — all while the tests poke at the modern Angular features (signals,
outputs, lifecycle hooks) your components are built from.

---

### Where to look for examples
- `TestBed` + `imports`/`providers` + `ComponentFixture` → every component spec, e.g.
  `src/app/components/poke-moves/poke-moves.spec.ts`
- `TestBed.inject` + HTTP mock (`expectOne`/`flush`/`verify`) → `src/app/services/pokeservice.spec.ts`
- `runInInjectionContext` + `CanActivateFn` → `src/app/guards/authentication-guard.spec.ts`
- `RouterTestingModule` → `src/app/app.spec.ts`
- Signals + `@Output` → `src/app/components/pokename/pokename.spec.ts`,
  `src/app/components/poke-type/poke-type.spec.ts`
- `ngOnChanges` + `ElementRef`/`Renderer2` → `src/app/directives/type.spec.ts`
- `BehaviorSubject` mock → `src/app/test/pokemon-fixture.ts`
