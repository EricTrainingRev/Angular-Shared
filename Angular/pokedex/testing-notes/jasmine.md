# Jasmine Notes

Jasmine is the *language* you write tests in. It isn't an Angular thing — you can use it to
test plain JavaScript or anything else. In this project it's the part of every `.spec.ts`
file that says "here's a test, here's what it checks." This page introduces the pieces the
Pokedex specs actually reach for, in plain language.

Think of a spec file as a **story** with a structure:

```
what are we talking about     -> describe(...)
set the scene first           -> beforeEach(...)
a specific check              -> it(...)
clean up afterwards           -> afterEach(...)
```

---

## The three building blocks you'll see everywhere

### `describe` — group related tests
A block that just labels a collection of tests. Every spec file has one, named after the
thing being tested (a component, service, guard…). It doesn't test anything itself — it
organizes.

```ts
describe('PokeMoves', () => { ... });
```

### `it` — a single test (an assertion about one behavior)
Each one should read like a sentence. Notice the project names them that way — "should
initialize moves from the cached pokemon", "should not render the name when it is empty."
A good test name tells you exactly what behavior broke when it fails.

```ts
it('should render each move name transformed by the pipe', () => {
  ...
});
```

### `beforeEach` / `afterEach` — set up and tear down between tests
Runs fresh **before/after every** `it` in the group. This is what keeps each test
independent — you're not relying on the previous test having run first.

- `beforeEach` in this project usually builds an Angular component and a mock service.
- `afterEach` is where you wipe things you touched, so one test can't leak into another.
  `user.spec.ts` and `login.spec.ts` clear `sessionStorage` both before and after; the
  `PokeService` spec calls `httpMock.verify()` after each test to assert no HTTP request
  was left over.

```ts
afterEach(() => {
  sessionStorage.clear();   // don't let one login test leak into the next
});
```

> Sometimes `beforeEach` is `async` and you `await` it. In the component specs that's how
> you wait for Angular to finish compiling the component before creating it:
> `await TestBed.configureTestingModule(...).compileComponents();`

---

## Matchers: the actual "checking"

Inside an `it`, `expect(thing)` is paired with a **matcher** that decides pass or fail.
Here are the ones this project uses, with what they mean:

| Matcher | Means | Seen in |
|---------|-------|---------|
| `toBeTruthy()` | "this exists / is not falsy" | every "should create" smoke test |
| `toBeNull()` | "this is exactly null" | `user.spec.ts` (no session flag) |
| `toBeTrue()` / `toBeFalse()` | "is exactly the boolean true/false" | guards, login, `home` (`pokemonPresent()`) |
| `toBe()` | exact equality (same string / reference) | string comparisons like `toBe('Pikachu')` |
| `toEqual()` | deep equality — same *structure and values* | comparing fixtures, arrays, objects |
| `toHaveBeenCalled()` | "this spy was invoked" | router, renderer, search |
| `toHaveBeenCalledWith(...)` | "invoked with these exact arguments" | `toHaveBeenCalledWith('pikachu')` |

The **difference between `toBe` and `toEqual`** is worth knowing:

- `toBe` asks "is it literally the same object/string?" — use it for primitives like text.
- `toEqual` asks "do they have the same contents?" — use it for objects/arrays. So the
  sprites test can say `expect(component.pokeSprites()).toEqual(pokemonFixture.sprites)`
  and it passes even though it's a different object instance with matching fields.

---

## Spies: fake functions you can watch

Jasmine's superpower. A **spy** is a stand-in function that:
1. records that it was called (and with what), and
2. can be told what to return — *without* running the real code.

This is how tests stay fast and deterministic (no real network calls, no real navigation).

### `spyOn` — wrap an existing method
Watch a method that already exists on a real object.

```ts
spyOn(component.colorReceived, 'emit');   // watch this output emit
```

Now you can ask "did it fire, and with what?":

```ts
expect(component.colorReceived.emit).toHaveBeenCalled();
const emitted = (component.colorReceived.emit as jasmine.Spy).calls.mostRecent().args[0];
```

`calls.mostRecent().args[0]` is Jasmine-speak for "grab the first argument from the last
time the spy was called." Handy when the thing you care about is *what got passed along*
rather than whether it was called.

### `createSpyObj` — build a whole fake object of methods
Make a fake object all at once, naming the methods you want it to have. The project
types these with `jasmine.SpyObj<T>` so the fake is checked against the real class's shape.

```ts
let routerSpy: jasmine.SpyObj<Router>;
routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
```

Then you can control behavior per test:

```ts
routerSpy.navigate.and.returnValue(Promise.resolve(true));   // tell it what to answer
```

and later assert on it:

```ts
expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
```

### `createSpy` — a lone fake function
A spy with no attached object. The shared mock service uses one for `searchPokemon` so
component tests can just confirm the service *was asked* the right thing:

```ts
searchPokemon: jasmine.createSpy('searchPokemon')
// later:
expect(mockPokeService.searchPokemon).toHaveBeenCalledWith('pikachu');
```

---

## When tests don't need Angular at all

Not every spec uses `TestBed`. Jasmine works fine on plain classes. Two specs lean on this
to keep things simple and fast — they skip Angular entirely and just call methods:

```ts
const pipe = new MoveTransformPipe();        // pure class, just construct it
expect(pipe.transform('solar-beam')).toBe('Solar Beam');
```

The `Type` directive does the same, passing fake dependencies straight into the constructor
(a fake element and a spy renderer), then driving the lifecycle method by hand. This
"manual instantiation" style is the most Jasmine-pure way to test — no framework involved,
just your code and a spy.

---

## Async tests

Some code is async (returns a Promise). Jasmine handles that by letting you `async`-ify
the `it` and `await` inside it. The login spec does this for its promise-based login:

```ts
it('should navigate to home on successful login', async () => {
  component.usernameInput = 'dev';
  component.passwordInput = 'dev';
  await component.attemptLogin();              // wait for the promise to settle
  expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
});
```

> One thing to notice: this project's tests are **synchronous wherever possible** — they
> use a mock service backed by `BehaviorSubject` and an HTTP mock that you flush
> immediately, so there's nothing to "wait" for. The docs for Karma and Angular features
> will show why that's elegant. Here, all you need is: when a method returns a Promise,
> `await` it before asserting.

---

## The formula behind every test

If you squint, almost every `it` in this project follows the same three beats:

1. **Arrange** — set up the situation (`input.value = 'charizard'`).
2. **Act** — do the thing (`button.click()` or `service.login('dev','dev')`).
3. **Assert** — check the result (`expect(...)`).

Following it keeps tests readable and predictable, which is exactly the quality this
spec suite is going for.

---

### Where to look for examples
- `beforeEach`/`afterEach` + session teardown → `src/app/services/user.spec.ts`
- spies (`createSpyObj`) + `runInInjectionContext` → `src/app/guards/authentication-guard.spec.ts`
- `createSpy` + `toHaveBeenCalledWith` → `src/app/components/search/search.spec.ts`
- `spyOn` + `calls.mostRecent()` → `src/app/components/poke-type/poke-type.spec.ts`
- pure-class tests (no Angular) → `src/app/pipes/move-transform-pipe.spec.ts`,
  `src/app/directives/type.spec.ts`
- async `it` → `src/app/components/login/login.spec.ts`
