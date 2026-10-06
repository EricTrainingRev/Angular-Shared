# Transformation & Encapsulation: Angular Pipes

## Table of Contents

* [1. High-Level Overview](#1-high-level-overview)
* [2. The Concept of Pipes](#2-the-concept-of-pipes)
* [3. Built-in Pipes](#3-built-in-pipes)
    * [3.1 The `AsyncPipe`: Handling Observables](#31-the-asyncpipe-handling-observables)
* [4. Custom Pipes](#4-custom-pipes)
    * [4.1 Creating a Custom Pipe](#41-creating-a-custom-pipe)
    * [4.2 Pure vs. Impure Pipes](#42-pure-vs-impure-pipes)
* [5. Encapsulation in Angular](#5-encapsulation-in-angular)
    * [5.1 View Encapsulation](#51-view-encapsulation)
    * [5.2 Encapsulation Strategies](#52-encapsulation-strategies)

***

## 1. High-Level Overview

In Angular, data often arrives in a raw format that is not ideal for direct display to the user (e.g., a raw Date object or a number that needs currency formatting). **Pipes** provide a declarative way to transform this data directly within your HTML templates. This module covers the mechanics of data transformation via pipes and the core principle of **Encapsulation**, which controls how component styles and logic are isolated.

[↑ Back to Table of Contents](#table-of-contents)
***

## 2. The Concept of Pipes

A **Pipe** is a class decorated with `@Pipe` that implements the `PipeTransform` interface. It takes an input value, performs a transformation, and returns a new value.

**The "Transformation" Workflow:**
`Raw Data` $\rightarrow$ `Pipe` $\rightarrow$ `Formatted Output`

The syntax uses the "pipe" character (`|`) in the template:
```html
{{ rawData | pipeName }}
```

[↑ Back to Table of Contents](#table-of-contents)
***

*Now that we understand what pipes do, let's look at the tools Angular provides out of the box.*

## 3. Built-in Pipes

Angular comes with several pre-built pipes for common transformation tasks.

| Pipe | Purpose | Example | Result (if input is `2023-01-01`) |
| :--- | :--- | :--- | :--- |
| `DatePipe` | Formats dates | `{{ date \| date:'short' }}` | `1/1/23, 12:00 AM` |
| `UpperCasePipe` | Converts to uppercase | `{{ 'hello' \| uppercase }}` | `HELLO` |
| `LowerCasePipe` | Converts to lowercase | `{{ 'HELLO' \| lowercase }}` | `hello` |
| `CurrencyPipe` | Formats numbers as currency | `{{ 10 \| currency:'USD' }}` | `$10.00` |
| `DecimalPipe` | Formats numbers with specific digits | `{{ 3.14159 \| number:'1.1-2' }}` | `3.14` |
| `JsonPipe` | Converts object to JSON string | `{{ myObj \| json }}` | `{"id": 1, ...}` |

### 3.1 The `AsyncPipe`: Handling Observables
While the pipes in the table above handle static data, real-world Angular applications are heavily **reactive**. Data often arrives as an asynchronous stream via an `Observable` or a `Promise`.

The **`AsyncPipe`** is a specialized tool that automates the subscription and unsubscription process, preventing memory leaks and simplifying template logic.

**The Workflow:**
`Observable/Promise` $\rightarrow$ `AsyncPipe` $\rightarrow$ `Unwrapped Value`

**Example: Subscribing in the Template**
Instead of manually calling `.subscribe()` in your TypeScript component, you can pipe the stream directly in the HTML:

```html
<!-- Automatically subscribes, gets the latest value, and unsubscribes when destroyed -->
<ul>
  <li *ngFor="let user of users$ | async">
    {{ user.name }}
  </li>
</ul>
```

**Why use it?**
| Benefit | Description |
| :--- | :--- |
| **Memory Management** | It automatically **unsubscribes** from the Observable when the component is destroyed, preventing memory leaks. |
| **Cleaner Code** | You don't need to manage `Subscription` variables or implement `OnDestroy` logic manually. |
| **Change Detection** | It works seamlessly with `OnPush` change detection strategy by marking the component to be checked when a new value arrives. |

> [!TIP]
> **Prefer the `AsyncPipe` over manual `.subscribe()` calls.** It makes your components more "declarative" and significantly reduces the risk of forgetting to clean up subscriptions.

[↑ Back to Table of Contents](#table-of-contents)

***

*While built-in pipes cover most basics, real-world applications often require domain-specific logic, leading us to Custom Pipes.*

## 4. Custom Pipes

When built-in pipes are insufficient, you can create your own to handle specific business logic.

### 4.1 Creating a Custom Pipe

To create a pipe, you use the `@Pipe` decorator and implement the `transform` method.

**Example: A "Square" Pipe**
```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'square',
  standalone: true
})
export class SquarePipe implements PipeTransform {
  transform(value: number): number {
    return value * value;
  }
}
```
**Usage in Template:**
```html
<p>The square of 5 is: {{ 5 | square }}</p> <!-- Output: 25 -->
```

### 4.2 Pure vs. Impure Pipes

A critical distinction in Angular performance is whether a pipe is **Pure** or **Impure**.

| Feature | **Pure Pipe** (Default) | **Impure Pipe** |
| :--- | :--- | :--- |
| **Execution Trigger** | Only when the **input value reference** changes. | On **every change detection cycle** (every mouse move, keystroke, etc.). |
| **Performance** | **High.** Very efficient for most use cases. | **Low.** Can cause significant lag if the logic is heavy. |
| **Best For** | Primitive types (strings, numbers) or immutable objects/arrays. | Detecting changes inside mutable objects or arrays (e.g., adding an item to an existing array). |

> [!TIP]
> **Always default to Pure pipes.** Only use Impure pipes if you are dealing with mutable data structures where a change in content doesn't change the object reference.

[↑ Back to Table of Contents](#table-of-contents)
***

*Transforming data is one part of the component lifecycle; controlling how that component's visual identity is contained is another. This brings us to Encapsulation.*

## 5. Encapsulation in Angular

**Encapsulation** in Angular refers to the mechanism that prevents a component's styles from "leaking" out and affecting the rest of the application, or vice versa. This is known as **View Encapsulation**.

### 5.1 View Encapsulation

Angular uses **Shadow DOM** concepts to achieve this. When you write CSS for a component, Angular automatically scopes those styles so they only apply to that component's HTML elements.

### 5.2 Encapsulation Strategies

Angular provides three different strategies for View Encapsulation via the `encapsulation` property in the `@Component` decorator.

| Strategy | Mechanism | Behavior |
| :--- | :--- | :--- |
| **`ViewEncapsulation.Emulated`** (Default) | Uses unique attributes (e.g., `_ngcontent-c1`) on elements. | Styles are scoped to the component by modifying selectors. It mimics Shadow DOM behavior without requiring browser support. |
| **`ViewEncapsulation.ShadowDom`** | Uses the browser's native **Shadow DOM** API. | Provides true isolation. Styles cannot penetrate the shadow boundary, and global styles cannot penetrate it either. |
| **`ViewEncapsulation.None`** | No scoping applied. | Styles are moved to the `<head>` of the document and become **Global**. They will affect every component in the app. |

**Comparison: Emulated vs. ShadowDom**

*   **Emulated:** Best for most apps. It provides the "feel" of isolation while still allowing some global styles (like typography or CSS variables) to work naturally.
*   **ShadowDom:** Best for creating web components intended for use in non-Angular environments where absolute, strict isolation is required.

> [!WARNING]
> Using **`ViewEncapsulation.None`** is dangerous. It can lead to "CSS Spaghetti" where a style change in one component unexpectedly breaks the layout of an entirely different part of the application.

[↑ Back to Table of Contents](#table-of-contents)
