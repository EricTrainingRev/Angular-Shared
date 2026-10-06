# Angular Components

## Table of Contents

* [1. High-Level Overview](#1-high-level-overview)
* [2. Component Fundamentals](#2-component-fundamentals)
* [3. Component Lifecycle](#3-component-lifecycle)
* [4. Component Styles](#4-component-styles)
* [5. Change Detection](#5-change-detection)
* [6. Dynamic Components](#6-dynamic-components)
* [7. Modules and the Component Relationship](#7-modules-and-the-component-relationship)

***

## 1. High-Level Overview

In Angular, the **Component** is the fundamental building block of the application's UI. Every Angular application is, at its core, a tree of components. A component encapsulates three essential things:
1.  **A Template:** The HTML that defines the view.
2.  **Styles:** The CSS that defines the look.
3.  **Logic:** The TypeScript class that manages the data and behavior.

By breaking a complex UI into small, reusable, and isolated pieces, Angular allows developers to build scalable and maintainable web applications.

[↑ Back to Table of Contents](#table-of-contents)

***

*Now that we understand what a component is, let's dive into the anatomy of a single component.*

## 2. Component Fundamentals

A component consists of a **TypeScript Class** decorated with the `@Component` decorator. This decorator provides the metadata that tells Angular how to process the class.

| Part | Role | Description |
| :--- | :--- | :--- |
| **Selector** | View Trigger | The custom HTML tag (e.g., `<app-user>`) used to instantiate the component. |
| **Template** | Structure | The HTML structure defining how the component renders. |
| **Styles** | Appearance | The CSS specific to this component. |
| **Class** | Behavior | The TypeScript code that handles data, user input, and business logic. |

### Anatomy of a Component
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  template: `<h1>Hello, {{ name }}!</h1>`,
  styles: [`h1 { color: blue; }`]
})
export class HelloWorldComponent {
  name: string = 'Angular Developer';
}
```

[↑ Back to Table of Contents](#table-of-contents)

***

*Building a component is easy, but managing its life—from creation to destruction—is critical for performance and stability.*

## 3. Component Lifecycle

Angular manages the entire life of a component through a series of **Lifecycle Hooks**. These are special methods that allow you to "tap into" specific moments in a component's existence.

### The Lifecycle Sequence

| Hook | Timing | Common Use Case |
| :--- | :--- | :--- |
| **`ngOnChanges`** | When an `@Input()` property value changes. | Reacting to data updates from a parent. |
| **`ngOnInit`** | Once, after the first `ngOnChanges`. | Initializing data, calling APIs, setting up subscriptions. |
| **`ngDoCheck`** | During every change detection cycle. | Custom change detection logic (use sparingly!). |
| **`ngAfterContentInit`** | After projected content (`<ng-content>`) is initialized. | Interacting with elements passed into the component. |
| **`ngAfterContentChecked`**| After every check of projected content. | Validating projected content state. |
| **`ngAfterViewInit`** | After the component's view (and children) is initialized. | DOM manipulation, initializing third-party UI libraries. |
| **`ngAfterViewChecked`** | After every check of the component's view. | Finalizing view-related logic. |
| **`ngOnDestroy`** | Just before the component is destroyed. | Unsubscribing from Observables, cleaning up timers/listeners. |

> [!TIP]
> Always prefer `ngOnInit` for initialization logic that involves `@Input` properties. The `constructor` is a native TypeScript feature used for dependency injection; at the time the constructor runs, Angular hasn't yet finished setting up the component's inputs.

> [!WARNING]
> While lifecycle hooks are powerful, they can become a source of performance bottlenecks if misused. Specifically, be extremely cautious with **`ngDoCheck`** and **`ngAfterContentChecked`** / **`ngAfterViewChecked`**. Because these methods execute during *every* change detection cycle, any heavy computation or logic placed within them will run repeatedly—often dozens of times per second—leading to significant UI lag. Similarly, avoid performing side effects that trigger *new* change detection cycles (like updating an `@Input` or an Observable) inside a lifecycle hook, as this can create infinite loops that crash your application.

[↑ Back to Table of Contents](#table-of-contents)

***

*A component's appearance is defined by its styles, but how those styles are applied (and isolated) is a key architectural decision.*

## 4. Component Styles

Angular provides **View Encapsulation**, a mechanism that prevents the CSS of one component from "leaking" out and affecting other parts of the application.

### Encapsulation Strategies

| Strategy | Behavior | Best For... |
| :--- | :--- | :--- |
| **`ViewEncapsulation.Emulated`** | (Default) Angular adds unique attributes (e.g., `_ngcontent-c1`) to HTML elements and CSS selectors to scope them. | Standard component development. High isolation with no performance penalty. |
| **`ViewEncapsulation.None`** | Styles are added to the document head and are global. | Creating global utility styles or overriding third-party component styles. |
| **`ViewEncapsulation.ShadowDom`** | Uses the browser's native Shadow DOM API to provide true, hard isolation. | Web Components or when you need strictly guaranteed isolation. |

### Emulated vs. ShadowDom

While both provide isolation, **Emulated** is the default because it works even in older browsers that don't support native Shadow DOM. **ShadowDom** offers a "cleaner" separation but can make it harder to style child components from the outside.

[↑ Back to Table of Contents](#table-of-contents)

***

*Once the styles are set, we must address the most complex part of Angular: how the framework knows when to update the screen.*

## 5. Change Detection

**Change Detection** is the process by which Angular detects that a value has changed and updates the DOM accordingly.

### The Evolution: From Zone.js to Zoneless

Traditionally, Angular relied on a library called **`Zone.js`**. `Zone.js` works by "monkey-patching" all asynchronous browser APIs (like `setTimeout`, `fetch`, and click events). When any of these events occur, `Zone.js` notifies Angular to run a check across the entire component tree.

While effective, the industry is moving toward **Zoneless Change Detection** (default in Angular v20+).

| Feature | **Zone.js (Legacy)** | **Zoneless (Modern)** |
| :--- | :--- | :--- |
| **Trigger** | **Implicit:** Any async task triggers a global check. | **Explicit:** Signals and specific API calls trigger updates. |
| **Performance** | **Coarse:** Often runs checks more frequently than necessary. | **Fine-grained:** Only updates what actually changed. |
| **Bundle Size** | **Larger:** Requires the `zone.js` dependency and polyfills. | **Smaller:** Removes the `zone.js` dependency entirely. |
| **Complexity** | **Higher:** Complex stack traces and potential API conflicts. | **Lower:** Cleaner stack traces and better ecosystem compatibility. |

### Change Detection Strategies

To optimize performance, Angular provides two primary strategies to control how often this check happens:

1.  **`ChangeDetectionStrategy.Default`**:
    *   **Behavior:** The component is checked every single time *any* change detection cycle runs anywhere in the app.
    *   **Pros:** Easy to use; "it just works."
    *   **Cons:** Can become slow in very large, complex applications.

2.  **`ChangeDetectionStrategy.OnPush`**:
    *   **Behavior:** The component is only checked if:
        *   An **`@Input()`** reference changes (e.g., a new object/array is passed).
        *   An event occurs inside the component (e.g., a button click).
        *   An **Observable** linked to the template via the **`async`** pipe emits a new value.
        *   **A Signal used in the template is updated.**
    *   **Pros:** Massive performance gains; ideal for "Pure" components.
    *   **Cons:** Requires careful management of object immutability.

> [!IMPORTANT]
> When using **`OnPush`** (or working in a **Zoneless** environment), you **must** use immutable data patterns. If you mutate a property inside an existing object (e.g., `this.user.name = 'New Name'`), Angular will **not** detect the change because the *reference* to the `user` object remains the same. In a Zoneless world, **Signals** are the preferred way to ensure the framework knows exactly when to react.

[↑ Back to Table of Contents](#table-of-contents)

***

*While standard components are static in their structure, sometimes we need to create components on the fly.*

## 6. Dynamic Components

**Dynamic Components** are components that are not hard-coded into a template but are instantiated programmatically at runtime.

### Use Cases
*   Modals/Dialog boxes that appear based on user action.
*   Ad banners or notification toasts.
*   Complex dashboards where widgets are loaded dynamically.

### The `ViewContainerRef` and `ComponentOutlet`
**`ViewContainerRef`** and **`ngComponentOutlet`** are two primary ways to render dynamic components:

1.  **`[ngComponentOutlet]` (The Declarative Way):**
    A built-in directive that allows you to pass a component class directly into the template.
    ```html
    <ng-container [ngComponentOutlet]="myDynamicComponentClass"></ng-container>
    ```

2.  **`ViewContainerRef` (The Programmatic Way):**
    Injecting **`ViewContainerRef`** into your class to manually create components using the **`createComponent()`** method. This provides the most control, allowing you to pass inputs and subscribe to outputs manually.

[↑ Back to Table of Contents](#table-of-contents)

***

*Components do not live in isolation; they are organized and distributed using Angular's module system.*

## 7. Modules and the Component Relationship

In older versions of Angular, **`NgModules`** were the primary way to group components. While **Standalone Components** (introduced as a developer preview in Angular 14, stable in Angular 15) are now the modern standard, understanding the relationship is vital for maintaining legacy code and understanding the underlying architecture.

### The Role of Modules
An `NgModule` acts as a container that declares which components belong to it, which other modules it depends on, and which parts of it are visible to the rest of the application.

| Module Property | Purpose |
| :--- | :--- |
| **`declarations`** | Lists all components, directives, and pipes that belong to this module. |
| **`imports`** | Lists other modules this module needs (e.g., `CommonModule`, `FormsModule`). |
| **`exports`** | Lists the components/directives that other modules are allowed to use. |
| **`providers`** | Lists services that should be available within this module. |

### Modern Shift: Standalone Components
With the move toward **Standalone Components**, the need for `NgModules` is drastically reduced. A standalone component manages its own dependencies via the `imports` array in its `@Component` decorator, effectively acting as its own mini-module.

### NgModule vs. Standalone

The transition from `NgModules` to **Standalone Components** represents a fundamental shift in how Angular applications are architected and scaled.

| Feature | **NgModule (Legacy)** | **Standalone (Modern)** |
| :--- | :--- | :--- |
| **Management** | **Centralized:** Components must be "declared" in a module to be used. | **Decentralized:** Components are self-contained and manage their own dependencies. |
| **Complexity** | **Higher:** Requires managing many boilerplate modules and complex dependency trees. | **Lower:** Reduces boilerplate; components are easily importable and testable. |
| **Scalability** | **Coarse:** Adding new features often requires modifying existing modules. | **Fine-grained:** Features can be added as isolated, independent units. |

**Key Distinction**
The fundamental difference lies in **ownership**. In an `NgModule` architecture, the *Module* owns the component. In a **Standalone** architecture, the *Component* owns itself. This makes Standalone components significantly easier to reuse across different projects and simplifies the mental model for developers.

[↑ Back to Table of Contents](#table-of-contents)
