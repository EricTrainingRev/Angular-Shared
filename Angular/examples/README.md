# Examples

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.24.

## `package.json` scripts

npm scripts are shortcuts defined under the `"scripts"` key in `package.json`. Run them with `npm run <name>` (e.g. `npm run start`, `npm run build`). Each one shells out to the Angular CLI (`ng`), so you need the Angular CLI installed (this repo's `node_modules` already contains it).

| npm script | Command it runs | What it does |
| --- | --- | --- |
| `ng` | `ng` | A bare alias for the Angular CLI itself. Lets Angular tooling and documentation reference the CLI via `npm run ng ...` without relying on a global install. Rarely run directly. |
| `start` | `ng serve` | Starts the **development server**. Serves the app from memory at `http://localhost:4200/` with live reload on file changes. This is your day-to-day `npm start`. |
| `build` | `ng build` | Compiles the project for **production** and writes optimized output (minified, tree-shaken, hashed assets) to `dist/`. The `production` configuration is the default, so no flags are needed. |
| `watch` | `ng build --watch --configuration development` | A **development-configuration build** that stays running and recompiles whenever you edit source files. Useful for checking compile errors without serving, or when a separate server serves the built files. |
| `test` | `ng test` | Runs the **unit tests** with the configured test runner (this project uses Vitest). It runs by default in **watch mode** (re-runs on file changes); use `ng test --watch=false` for a one-shot run, e.g. in CI. |
| `format` | `prettier --write .` | Runs Prettier across the project and **rewrites** files to match the formatting rules. |
| `format:check` | `prettier --check .` | Checks whether files already conform to the formatting rules **without changing them**. Fails (non-zero exit) if anything is unformatted — useful in CI. |

### Flags worth knowing

- `ng serve --open` (`-o`) opens the app in your browser automatically.
- `ng serve --port 4300` changes the dev-server port.
- `ng build --configuration development` produces an unoptimized build for debugging.
- `ng build --configuration production` is what the default `build` uses (explicit and equivalent).

## `angular.json`

`angular.json` is the Angular CLI's project configuration. It tells the CLI what projects exist, how to build/serve/test them, and with what options.

### The big picture: architect targets and builders

The heart of the file is the `architect` section. Each entry under it is a **target** — a named operation the CLI can run (`build`, `serve`, `test`). Each target points at a **builder** (a package that implements the operation) plus its `options` and named `configurations`.

```text
architect (what you can do) -> target (build/serve/test) -> builder (which tool) -> options/configurations
```

| Target | Builder | What it does |
| --- | --- | --- |
| `build` | `@angular/build:application` | Compiles the app. The modern esbuild-based application builder (replaces the older `@angular-devkit/build-angular:browser`). |
| `serve` | `@angular/build:dev-server` | Runs the development server. It delegates to the `build` target (see `buildTarget`). |
| `test` | `@angular/build:unit-test` | Runs unit tests with the configured runner (Vitest in this project). |

### Configurations and the default

Each target can define named **configurations** — option overrides for different situations. The `defaultConfiguration` field picks which one is used when you don't specify one on the command line.

- `build` has `production` (default) and `development` configurations.
- `serve` has `production` and `development` configurations, defaulting to `development`.

This is why `ng build` produces an optimized production bundle while `ng serve` gives you a fast, unoptimized dev server — each target has a different default configuration.

### Budgets (why builds fail with "budget exceeded")

The `production` build configuration sets **budgets** — size limits that warn or error when a bundle grows too large. This is a common source of build failures as an app grows.

| Budget type | What it measures | Warning | Error |
| --- | --- | --- | --- |
| `initial` | The initial bundle loaded on startup | 500 kB | 1 MB |
| `anyComponentStyle` | Any single component's stylesheet | 4 kB | 8 kB |

Exceeding the warning threshold prints a warning; exceeding the error threshold fails the build.

### Project identity

- `projectType: "application"` — this is an app (as opposed to a `library`).
- `root: ""` — the project lives at the workspace root (not in a subfolder).
- `sourceRoot: "src"` — source files live under `src/`.
- `prefix: "app"` — the selector prefix for generated components, e.g. `<app-root>`.

### Assets, styles, and output hashing (brief)

- `assets` copies static files (here, everything under `public/`) into the build output unchanged.
- `styles` lists global stylesheets (here, `src/styles.css`) that are bundled into the app.
- `outputHashing: "all"` (in `production`) appends a content hash to output filenames so browsers fetch fresh files after a deploy instead of serving stale cached ones.

## `.prettierrc`

`.prettierrc` configures **Prettier**, the opinionated code formatter.

- `printWidth: 100` — wraps lines at 100 characters (Prettier's default is 80).
- `singleQuote: true` — uses single quotes (`'...'`) instead of double quotes for strings.
- `overrides` — a special rule just for `*.html` files: use the **`angular` parser**, so Prettier understands Angular template syntax (`@if`, `*ngIf`, `[property]`, `(event)`, etc.) instead of treating HTML as plain markup.

Run the formatter with `npm run format` (rewrites files) or `npm run format:check` (checks without changing, for CI).

## Bundlers

A **bundler** is a tool that takes all of your source files (TypeScript, HTML, CSS, images, third-party libraries) and combines them into a small number of files the browser can load. Modern apps are written as many small modules, but browsers historically load files one at a time — so a bundler resolves imports, merges everything into a few optimized bundles, and applies transformations (minification, tree-shaking, asset inlining).

### The current bundler: esbuild

This project uses **esbuild** as its bundler, via the `@angular/build:application` builder (see the `angular.json` section above). esbuild is a fast, modern bundler written in Go. Angular adopted it as the default in v17, replacing webpack, because it is dramatically faster at both dev builds and production builds.

### The previous bundler: webpack

Before esbuild, Angular used **webpack** as its bundler, via the older `@angular-devkit/build-angular:browser` builder. Webpack is a powerful, highly configurable bundler with a large plugin ecosystem, but it is slower and requires more configuration. If you see references to `@angular-devkit/build-angular:browser` or a `webpack.config.js` in older Angular projects, that is the webpack-based setup.

### Why it matters here

You don't configure the bundler directly in this project — the Angular builder handles it for you. But understanding the bundler explains several things you've seen:

- **`module: "preserve"`** in `tsconfig.json` keeps `import`/`export` statements intact so the bundler (esbuild) can process them.
- **Budgets** (in `angular.json`) measure the size of the bundles the bundler produces.
- **`outputHashing`** names the bundled output files with content hashes for caching.
- The `dist/` folder produced by `ng build` contains the final bundled output ready to deploy.
