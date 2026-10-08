# Karma Notes

Jasmine gives you the *words* to write a test. **Karma is the *stage* the test runs on.**
It's a test runner: it opens a real web browser, loads your spec files into it, runs them,
and reports what passed and failed.

One of the first things to know about *this* project: **there is no `karma.conf.js` file.**
Most Karma tutorials show you a config file — but the Angular CLI manages all that behind
the scenes. Karma is configured here through `angular.json`, in the `test` "target" of your
project. So when you read about Karma, remember: for this repo, think of `angular.json` as
where Karma's options live.

---

## Where Karma is configured here

Look at the `test` entry in `angular.json`:

```
"test": {
  "builder": "@angular/build:karma",
  "options": { ... }
}
```

This tells the Angular CLI: *"when I run `ng test`, use the Karma builder with these
options."* The options that matter for beginners:

| Option | Value here | What it does |
|--------|-----------|--------------|
| `builder` | `@angular/build:karma` | Plug the Karma runner into `ng test` |
| `polyfills` | `["zone.js", "zone.js/testing"]` | Angular's async tracking magic (see below) |
| `tsConfig` | `tsconfig.spec.json` | Which TypeScript files get compiled for testing |

And `tsconfig.spec.json` (which `tsConfig` points at) is itself interesting:

```json
"types": ["jasmine"]
```

That line is why the editor/compiler understands `describe`, `it`, `expect`, `jasmine`
everywhere in your spec files without you importing them — the Jasmine global types are
switched on for specs only.

The package you actually run on the command line is defined in `package.json`:

```json
"test": "ng test"
```

So `npm test` → `ng test` → the Karma builder → a browser runs your specs.

---

## The pieces of Karma (and what each does)

Karma itself is a lightweight core. Almost all of its real work comes from **plugins**, which
are separate packages in `devDependencies`. Here's the lineup in this project:

| Package | Role |
|---------|------|
| `karma` | The runner core — the thing that starts/stops things and collects results |
| `karma-jasmine` | The friendly link between Karma and Jasmine — it's what makes Karma *know how to run* Jasmine specs |
| `karma-chrome-launcher` | Tells Karma which browser to open and how (here: Chrome/Chromium) |
| `karma-jasmine-html-reporter` | Draws the pretty interactive results page in the browser |
| `karma-coverage` | Measures how much of your source code the tests actually execute |
| `jasmine-core` | Jasmine *itself* (the `describe`/`it`/`expect` library) |

The mental model: **Karma is the bouncer/organizer, and the plugins are the specialists.**
`karma` alone doesn't know what a test even is — `karma-jasmine` teaches it Jasmine,
`karma-chrome-launcher` gives it a browser to run in, and the reporters turn results into
something you can read.

---

## How a test actually gets "run" by Karma

This is the part that feels surprising at first, so it's worth stating plainly:

**Your tests do not run in Node. They run in a real web browser.**

The flow is:

1. You type `ng test`.
2. The `@angular/build:karma` builder **compiles** your TypeScript specs (using
   `tsconfig.spec.json`) into browser-ready JavaScript and collects them.
3. Karma **launches a Chrome/Chromium browser** window (or headless, for automation).
4. It **loads all the compiled spec files** into that browser page.
5. `karma-jasmine` hands control to Jasmine, which runs every `describe`/`it` **inside the
   browser**.
6. The browser sends results back to Karma, which forwards them to the reporters.

Because the tests run in a browser, they can touch real browser things — `document`,
`sessionStorage`, DOM elements — which is exactly why components testing works. Angular and
your components are browser-native, so they get exercised in their natural environment.

### Why those `zone.js` polyfills matter
Angular's change detection is asynchronous — it needs to know *when* things happen to know
*when to update the screen*. `zone.js` tracks async activity so Angular doesn't miss it.
`zone.js/testing` is the testing companion that makes Karma **wait** until pending async
work (like a timer or an in-flight request) settles before deciding a test is done — so a
test can't "finish" while background work is still happening.

---

## Reporting: how you find out what happened

When the browser runs the specs, the results fan out to two reporters:

- **`karma-jasmine-html-reporter`** — the visual one. In the launched browser window it
  draws a clickable page showing every spec, its status, and failure details. Green =
  pass, red = fail. This is the page you glance at while developing.
- **CLI/console reporter** (built into how `ng test` prints) — the text summary in your
  terminal: dots for passed specs, letters/symbols for failures, and a final tally like
  "Executed 5 of 5 SUCCESS."

The `karma-coverage` plugin is available too — it computes what percentage of your source
code the specs exercise and can produce a report. (In this project coverage isn't actively
configured in `angular.json`, so it's *available* but not turned on by default — worth
mentioning so you don't assume the CLI always runs it.)

---

## Watch mode and looping

By default `ng test` runs in **watch mode**. Here's the loop:

1. Run all the specs in the browser, report results.
2. **Keep the browser open and keep watching** your source files.
3. You edit a `.ts` file → Karma recompiles and reruns the specs automatically → instant
   feedback.

This is the *development* workflow — you get a red/green answer the moment you save. When a
build/CI system wants a one-shot run instead, it uses a `--watch=false` flag (or headless
Chrome) to run once and exit with pass/fail.

---

## Keeping it straight

A one-line summary of who does what, end to end:

> `ng test` → **Karma** opens a browser → **karma-jasmine** runs the **Jasmine** specs →
> the components touch the DOM / `sessionStorage` / mocked HTTP right there in the browser →
> results go to the **HTML reporter** (browser page) and the **console reporter** (terminal).

Jasmine *defines* the test. Karma *runs* the test in a browser and reports the result.
That division — authoring in Jasmine, executing/reporting in Karma — is the core idea the
"Test Overview" document pulls together next.

---

### Where to look for examples
- Karma config lives in `angular.json` (`architect.test`), not a `karma.conf.js`
- Test TypeScript setup → `tsconfig.spec.json` (note `"types": ["jasmine"]`)
- Karma + its plugins → `devDependencies` in `package.json`
