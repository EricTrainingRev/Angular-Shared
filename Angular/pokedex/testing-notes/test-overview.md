# Test Overview — How It All Fits Together

This is the "big picture" document. The other three pages explain the pieces:

- **Jasmine** — the *language* you write tests in (`describe`, `it`, `expect`, spies).
- **Karma** — the *runner* that opens a browser, executes the specs, and reports results.
- **Angular testing** — the *tools* that assemble a component with faked dependencies and
  the modern Angular features the tests poke at.

Here we watch all three cooperate on one real spec file, from the moment you type `npm test`
to the moment you see a green checkmark. The worked example is `search.spec.ts`, which tests
the `Search` component — a good choice because it uses every layer: `TestBed`, a mock service,
real DOM interaction, and a spy assertion.

---

## The cast

First, the players. The spec under the microscope:

```ts
// src/app/components/search/search.spec.ts
describe('Search', () => {
  let component: Search;
  let fixture: ComponentFixture<Search>;
  let mockPokeService: MockPokeService;

  beforeEach(async () => {
    mockPokeService = createMockPokeService();                    // (A) build the fake service
    await TestBed.configureTestingModule({                         // (B) assemble the workbench
      imports: [Search],
      providers: [{ provide: PokeService, useValue: mockPokeService }]
    }).compileComponents();
    fixture = TestBed.createComponent(Search);                     // (C) build the component
    component = fixture.componentInstance;
    fixture.detectChanges();                                       // (D) render it
  });

  it('should call searchPokemon when the search button is clicked', () => {
    const input = fixture.nativeElement.querySelector('input.pokedex-search-input');
    const button = fixture.nativeElement.querySelector('button.pokedex-search-button');

    input.value = 'charizard';                                     // (E) type into the box
    input.dispatchEvent(new Event('input'));                       // (F) fire the input event
    fixture.detectChanges();                                       // (G) let ngModel catch up
    button.click();                                                // (H) click the button

    expect(mockPokeService.searchPokemon).toHaveBeenCalledWith('charizard');  // (I) assert
  });
});
```

And the component it tests:

```ts
// src/app/components/search/search.ts
@Component({ selector: 'app-search', imports: [FormsModule], ... })
export class Search {
  searchValue = "";                                  // bound to the input via ngModel
  constructor(private pokeService: PokeService) {}
  searchForPokemon() {
    this.pokeService.searchPokemon(this.searchValue);   // the real call we're faking
  }
}
```

---

## The journey, step by step

### Step 1 — `npm test` hands off to Karma
`npm test` runs `ng test`, which reads the `test` target in `angular.json` and invokes the
`@angular/build:karma` builder. **Karma** is now in charge.

### Step 2 — Karma compiles and bundles the specs
Using `tsconfig.spec.json` (which enables the `jasmine` types), the builder compiles
`search.spec.ts` and its dependencies into browser-ready JavaScript. It also loads the
`zone.js`/`zone.js/testing` polyfills so Angular's async tracking works.

### Step 3 — Karma launches a browser and loads the specs
Karma opens a Chrome/Chromium window and loads the compiled spec files into it. From here on,
**everything runs inside the browser** — not Node. That's why the test can touch real DOM.

### Step 4 — `karma-jasmine` starts Jasmine
`karma-jasmine` hands control to **Jasmine**, which begins executing the `describe('Search')`
block. Jasmine runs the `beforeEach` before every `it`.

### Step 5 — `beforeEach` uses Angular to build the component
This is where **Angular testing** takes over:

- **(A)** `createMockPokeService()` builds a fake `PokeService` whose `searchPokemon` is a
  Jasmine spy and whose data stream is a `BehaviorSubject`.
- **(B)** `TestBed.configureTestingModule` assembles a mini-app: import the `Search` component
  and tell Angular "when anything asks for `PokeService`, give it the mock." The component
  will *think* it has a real service.
- **(C)** `TestBed.createComponent(Search)` builds the actual component and returns a
  `ComponentFixture` — a handle to both the component object and its rendered DOM.
- **(D)** `fixture.detectChanges()` tells Angular to render the view.

### Step 6 — the `it` block simulates a user
Now the test acts like a person using the app:

- **(E)** It finds the real `<input>` and `<button>` in the rendered DOM.
- **(F)** It types "charizard" and dispatches an `input` event — the same event a real
  keystroke would fire.
- **(G)** `detectChanges()` lets Angular's `ngModel` binding copy the input value into
  `component.searchValue`.
- **(H)** `button.click()` triggers the click handler, which calls
  `searchForPokemon()` → `this.pokeService.searchPokemon('charizard')`.

### Step 7 — the assertion checks the spy
Because `pokeService` is the mock, the "real" call never happens. Instead, the Jasmine spy
records it. The assertion asks: *"was `searchPokemon` called with 'charizard'?"*

```ts
expect(mockPokeService.searchPokemon).toHaveBeenCalledWith('charizard');
```

If yes → the test passes. If the component called it with the wrong value (or not at all) →
the test fails, and Jasmine reports exactly what was expected vs. what happened.

### Step 8 — results flow back to the reporters
The browser sends the pass/fail result back to Karma, which forwards it to the reporters:
the **HTML reporter** draws the green/red page in the browser, and the **console reporter**
prints the summary in your terminal.

---

## Who did what? (the division of labor)

| Phase | Who's in charge | What happens |
|-------|----------------|--------------|
| Kickoff | **Karma** | `ng test` → builder → compile + bundle specs |
| Execution | **Karma** | Launch browser, load specs, run them |
| Test logic | **Jasmine** | `describe`/`it`/`beforeEach`, matchers, spies |
| Component setup | **Angular** | `TestBed` builds the component with faked deps |
| Rendering | **Angular** | `ComponentFixture` + `detectChanges()` render the view |
| Interaction | **Browser** | Real DOM events (`input`, `click`) fire |
| Assertion | **Jasmine** | `expect(...).toHaveBeenCalledWith(...)` |
| Reporting | **Karma** | HTML reporter (browser) + console reporter (terminal) |

The clean way to remember it:

> **Jasmine defines the test. Angular builds the thing being tested. Karma runs it in a
> browser and reports the result.**

---

## Why this design is so nice for beginners

A few things worth appreciating about how this all fits together:

- **No real network, no real navigation.** The service is a mock, so the test is fast,
  isolated, and deterministic — it can't break because the internet is down.
- **It runs in a real browser.** The test exercises the component the way a user actually
  would — typing, clicking, reading the screen — so it catches real rendering bugs, not just
  logic bugs.
- **You control the timing.** `detectChanges()` means nothing updates until you say so, and
  the mock answers instantly — so there's no waiting, no flaky timing, no `setTimeout` games.
- **Each layer is replaceable.** You could swap the browser (headless Chrome for CI), the
  reporter, or the mock — without touching the test's logic.

---

## Where each document fits

| Document | Explains |
|----------|----------|
| `jasmine.md` | Steps 4, 6, 7 — the test language, matchers, spies |
| `karma.md` | Steps 1–3, 8 — the runner, browser, reporters |
| `angular-features.md` | Step 5 — `TestBed`, `ComponentFixture`, mocks, signals |
| **this file** | The whole journey, end to end |

Read the other three for depth; read this one to see how they connect.
