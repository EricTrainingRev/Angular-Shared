# Angular Data Flow & Communication

## Table of Contents

* [1. High-Level Overview](#1-high-level-overview)
* [2. One-Way Data Binding](#2-one-way-data-binding)
* [3. Two-Way Data Binding](#3-two-way-data-binding)
* [4. Sharing Data Between Child and Parent](#4-sharing-data-between-child-and-parent)
    * [4.1 Parent to Child: `@Input()`](#41-parent-to-child-input)
    * [4.2 Child to Parent: `@Output()` & Event Emitters](#42-child-to-parent-output--event-emitters)
    * [4.3 Modern Alternative: Signal-based APIs](#43-modern-alternative-signal-based-apis)
* [5. Summary Comparison](#5-summary-comparison)
    * [5.1 Core Data Bindings](#51-core-data-bindings)
    * [5.2 Component Communication](#52-component-communication)

***

## 1. High-Level Overview

In Angular, **Data Flow** refers to the direction in which information travels between your component's logic (TypeScript) and its visual representation (HTML template). Effective communication is the backbone of any modular application, allowing independent components to synchronize their states and react to user interactions.

This module covers the fundamental mechanisms of data movement: from simple binding within a single component to complex communication patterns between parent and child components.

[↑ Back to Table of Contents](#table-of-contents)

***

*Now that we understand the "What," let's look at the simplest form of data movement: one-way communication.*

## 2. One-Way Data Binding

**One-Way Data Binding** is a unidirectional flow where information moves in exactly one direction. In Angular, this typically means data flows from the **Component Class** to the **Template**.

There are two primary ways to implement one-way binding:

### 2.1 Interpolation `{{ }}`
Interpolation is the most common way to display dynamic text. It evaluates an expression and converts the result into a string within the HTML.

```typescript
// Component Class
export class UserComponent {
  username = 'Hermes';
}
```

```html
<!-- HTML Template -->
<p>Welcome, {{ username }}!</p>
```

### 2.2 Property Binding `[ ]`
Property binding allows you to set the value of a specific HTML attribute or a component property. This is essential for controlling element states like `disabled`, `src`, or `href`.

```typescript
// Component Class
export class UserComponent {
  imageUrl = 'assets/logo.png';
  isDisabled = true;
}
```

```html
<!-- HTML Template -->
<img [src]="imageUrl">
<button [disabled]="isDisabled">Click Me</button>
```

> [!TIP]
> **One-Way vs. Two-Way:** In One-Way binding, if the variable in the TypeScript class changes, the UI updates automatically. However, if the user types into an input field, the variable in the class **will not** change unless you implement Two-Way binding.

[↑ Back to Table of Contents](#table-of-contents)

***

*While one-way binding is sufficient for displaying data, interactive forms require a more seamless synchronization. This brings us to Two-Way Data Binding.*

## 3. Two-Way Data Binding

**Two-Way Data Binding** creates a bidirectional synchronization between the component logic and the view. If the user changes a value in the UI (e.g., typing in an input), the component property is updated immediately. If the component property is updated via code, the UI reflects that change instantly.

Angular implements this using the `[(ngModel)]` directive, often referred to as the **"Banana in a Box"** syntax.

### 3.1 Implementation Requirements
To use `ngModel`, you must import the `FormsModule` in your Angular module or standalone component.

```typescript
// In a standalone component's imports array, or an NgModule's imports array
import { FormsModule } from '@angular/forms';

// ... inside the imports array
imports: [ FormsModule ]
```

### 3.2 Example Usage
```typescript
// Component Class
export class ProfileComponent {
  nickname = 'Explorer';
}
```

```html
<!-- HTML Template -->
<input [(ngModel)]="nickname">
<p>Your nickname is: {{ nickname }}</p>
```

**How it works under the hood:**
`[(ngModel)]="nickname"` is actually syntactic sugar for combining **Property Binding** and **Event Binding**:
`[ngModel]="nickname" (ngModelChange)="nickname = $event"`

[↑ Back to Table of Contents](#table-of-contents)

***

*One-way and two-way binding handle data within a single component. But real-world apps are built of trees of components that need to talk to each other. Let's explore how to pass data between them.*

## 4. Sharing Data Between Child and Parent

In Angular's component hierarchy, communication follows a strict pattern: **Data flows down (Parent $\rightarrow$ Child), and Events flow up (Child $\rightarrow$ Parent).**

### 4.1 Parent to Child: `@Input()`

The `@Input()` decorator marks a class property as an "entry point" for data coming from a parent component.

**The Child Component:**
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<p>Message from parent: {{ childMessage }}</p>`
})
export class ChildComponent {
  @Input() childMessage: string = ''; 
}
```

**The Parent Component:**
```html
<!-- Parent Template -->
<app-child [childMessage]="'Hello from Parent!'"></app-child>
```

### 4.2 Child to Parent: `@Output()` & Event Emitters

To send information back up to a parent, a child component uses the `@Output()` decorator combined with an `EventEmitter`.

**The Child Component:**
```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<button (click)="sendMessage()">Notify Parent</button>`
})
export class ChildComponent {
  @Output() messageEvent = new EventEmitter<string>();

  sendMessage() {
    this.messageEvent.emit('The button was clicked!');
  }
}
```

**The Parent Component:**
```typescript
// Parent Class
export class ParentComponent {
  receiveMessage(msg: string) {
    console.log('Received:', msg);
  }
}

// Parent Template
<app-child (messageEvent)="receiveMessage($event)"></app-child>
```

> [!IMPORTANT]
> **The `$event` Object:** When listening to an `@Output()` event in the template, the data emitted by the `EventEmitter` is captured via the special `$event` variable.

### 4.3 Modern Alternative: Signal-based APIs
While the decorators `@Input()` and `@Output()` are the industry standard, modern Angular is moving toward **Signal-based inputs and outputs**. These provide finer-grained reactivity and better performance by allowing Angular to track exactly where data is used without relying on heavy "change detection" cycles.

**The Child Component:**
```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <p>Message: {{ childMessage() }}</p>
    <button (click)="sendMessage()">Notify Parent</button>
  `
})
export class ChildComponent {
  // Signal-based Input (Read-only)
  childMessage = input<string>(''); 

  // Signal-based Output
  messageEvent = output<string>();

  sendMessage() {
    this.messageEvent.emit('Signal-based notification!');
  }
}
```

**The Parent Component:**
*(Note: The syntax in the Parent template remains identical to the decorator approach, ensuring backward compatibility for the consumer.)*
```html
<app-child [childMessage]="'Hello from Signal Parent!'" 
           (messageEvent)="receiveMessage($event)"></app-child>
```

**Comparison: Decorators vs. Signals**

| Feature | Decorator-based (Traditional) | Signal-based (Modern) |
| :--- | :--- | :--- |
| **Declaration** | `@Input() name: string;` | `name = input<string>();` |
| **Accessing Value** | `this.name` | `this.name()` (must call as a function) |
| **Reactivity** | Relies on Zone.js (checks entire component tree) | Fine-grained (only updates specific dependencies) |
| **Complexity** | Lower; easier for beginners to grasp | Slightly higher; requires understanding Signal lifecycle |

> [!TIP]
> **When to use which?** If you are working in a legacy codebase, stick to `@Input()`. If you are starting a new project in Angular 17.2+, prefer `input()` to take advantage of the improved reactivity engine.

[↑ Back to Table of Contents](#table-of-contents)

***

*Now that we have covered the individual mechanics, let's synthesize everything into a quick-reference guide.*

## 5. Summary Comparison

### 5.1 Core Data Bindings
These mechanisms handle how data moves between a single component's logic and its HTML template.

| Mechanism | Direction | Syntax | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **Interpolation** | Component $\rightarrow$ View | `{{ value }}` | Displaying text content. |
| **Property Binding** | Component $\rightarrow$ View | `[property]="value"` | Setting element attributes/properties. |
| **Event Binding** | View $\rightarrow$ Component | `(event)="method()"` | Responding to user actions (clicks, input). |
| **Two-Way Binding** | Bidirectional | `[(ngModel)]="value"` | Form inputs and synchronized state. |

### 5.2 Component Communication
These mechanisms handle how data moves between different components in the application hierarchy.

| Pattern | Type | **Traditional (Decorator)** | **Modern (Signal-based)** |
| :--- | :--- | :--- | :--- |
| **Downwards** | Parent $\rightarrow$ Child | `@Input() name: string;` | `name = input<string>();` |
| **Upwards** | Child $\rightarrow$ Parent | `@Output() changed = new EventEmitter();` | `changed = output<string>();` |

[↑ Back to Table of Contents](#table-of-contents)
