# Testing Documentation — Game Plan

Goal: author 4 reference documents inside `testing-notes/` describing how the Pokedex
test suite (karma + jasmine + Angular 20.2) is built, configured, and executed.

Sources of truth we already gathered (2016-era snapshot re-checked this session):
- All 14 spec files under `src/app/**/*.spec.ts`
- Shared fixture/mock: `src/app/test/pokemon-fixture.ts`
- `package.json` (devDeps: karma ~6.4, jasmine-core ~5.9, karma-jasmine ~5.1,
  karma-chrome-launcher, karma-coverage, karma-jasmine-html-reporter, @types/jasmine)
- `angular.json` test target (`@angular/build:karma`, polyfills `zone.js` + `zone.js/testing`,
  tsConfig `tsconfig.spec.json`, no standalone `karma.conf.js`)

---

## Deliverable structure

Four markdown files in `testing-notes/`:

1. `testing-notes/jasmine.md`
2. `testing-notes/karma.md`
3. `testing-notes/angular-features.md`
4. `testing-notes/test-overview.md`

(Hook: each file should state which spec file(s) it draws its examples from, so a reader
can jump back into the code. Example use a reproducible path:line reference.)

---

## Document-by-document outline

### 1. `jasmine.md` — the spec language
Covers the pure-Jasmine surface (everything that does NOT require Angular).
- Test structure: `describe` / `it` / `beforeEach` / `afterEach`, including the
  `async`/`await` `beforeEach` used to await `compileComponents()`.
- Matchers actually used: `toBeTruthy`/`toBeNull`/`toBeTrue`/`toBeFalse`, `toEqual`/`toBe`,
  `toHaveBeenCalled`/`toHaveBeenCalledWith`, `.calls.mostRecent().args`.
- Spies: `createSpyObj<T>` (typed), `createSpy`, `spyOn`; stubbing with `.and.returnValue`.
- Calling conventions: manual instantiation tests that never touch TestBed
  (`new MoveTransformPipe()`, `new Type(element, renderer)`).
- Async in specs: `it(... async)` + `await` on promise-returning methods.
- Note `jasmine.SpyObj<T>` / `jasmine.Spy` typing.

### 2. `karma.md` — the test runner
Covers how this project actually runs Karma (there is NO karma.conf.js).
- `angular.json` `test` target → `@angular/build:karma`, polyfills, tsConfig.
- How specs are discovered/compiled from `src`.
- The karma plugins in `devDependencies` and what each does:
  karma, karma-jasmine (framework adapter), karma-chrome-launcher (browser),
  karma-jasmine-html-reporter, karma-coverage.
- Execution model: a real Chromium browser runs the specs; how `ng test` starts/kills it.
- Reporting & watch behavior: html reporter in the launched browser, CLI console output.
- What the project does NOT configure (no codeCoverage block in angular.json, no custom
  browsers/bundlers) — call out explicitly so readers don't assume defaults from the CLI.

### 3. `angular-features.md` — Angular testing APIs + Angular APIs under test
- `TestBed.configureTestingModule`, `imports:` (standalone component import), `providers:`
  with `{ provide: X, useValue: mock }`.
- `TestBed.createComponent` → `ComponentFixture`; `componentInstance`, `nativeElement`,
  `detectChanges()`.
- `TestBed.inject`, `TestBed.runInInjectionContext`.
- `RouterTestingModule`, `CanActivateFn`.
- HTTP testing: `provideHttpClient` + `provideHttpClientTesting`, `HttpTestingController`
  (`expectOne`, `flush`, `verify`).
- Angular (app) APIs exercised: signals, `@Output`/`OutputEmitterRef`, `@Input` +
  `ngOnChanges` + `SimpleChanges`, `ElementRef`/`Renderer2`, `BehaviorSubject`-backed service mock.
- DOM assertions via `fixture.nativeElement.querySelector*`.

### 4. `test-overview.md` — end-to-end walkthrough
One narrative tracing how all three stack levels cooperate. Pick ONE representative spec
(maintainer's choice — recommend `search.spec.ts`, which uses TestBed + a mock service +
DOM events) and walk it through the whole pipeline:
1. `ng test` reads `angular.json` test target (Karma builder).
2. Builder compiles `tsconfig.spec.json` + polyfills and bundles specs.
3. Karma launches Chromium; karma-jasmine registers the Jasmine runtime.
4. `beforeEach` builds the Angular testing module; `TestBed` creates the component.
5. Specs run in the browser; spies/HTTP mock/BehaviorSubject keep it deterministic.
6. Assertions report to karma-jasmine HTML reporter + CLI; coverage if enabled.
Include a short table mapping each `testing-notes` doc to the phase it explains.

---

## Suggested execution order

The 4 docs are largely independent once the overview references them, but a sensible
dependency-safe order is:

1. `jasmine.md` (pure, self-contained — no Angular knowledge needed)
2. `angular-features.md` (builds concepts 1 uses and that Karma executes)
3. `karma.md` (the runner that compiles/executes items 1 & 2)
4. `test-overview.md` (ties 1–3 together into one flow — write last)

Each doc reviewed/approved before moving to the next (per your one-at-a-time workflow).

## Open questions to confirm before starting

- Confirm the docs should render as plain markdown reference notes (no build/tab format).
- Filename casing confirmed as lowercase (`jasmine.md`, `karma.md`, etc.).
- For "test-overview" pick `Search` sear as the worked example, or would you prefer
  `authentication-guard` (guard + spies + runInInjectionContext, no DOM)?
