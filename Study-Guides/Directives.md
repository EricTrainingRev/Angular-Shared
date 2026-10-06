# Angular: Directives & UI Logic

## Table of Contents

* [1. High-Level Overview](#1-high-level-overview)
* [2. Understanding Directives](#2-understanding-directives)
    * [2.1 Directives vs Components](#21-directives-vs-components)
* [3. Built-in Directives](#3-built-in-directives)
    * [3.1 Structural Directives & The New Control Flow](#31-structural-directives--the-new-control-flow)
    * [3.2 Attribute Directives](#32-attribute-directives)
* [4. Data Binding and Directives](#4-data-binding-and-directives)
    * [4.1 The Binding Taxonomy](#41-the-binding-taxonomy)
* [5. Creating Custom Directives](#5-creating-custom-directives)
    * [5.1 Building an Attribute Directive](#51-building-an-attribute-directive)
    * [5.2 Building a Structural Directive](#52-building-a-structural-directive)

***

## 1. High-Level Overview

In Angular, the user interface is more than just static HTML. To create dynamic, interactive, and intelligent layouts, Angular uses **Directives**. A directive is essentially a class that adds new behavior to elements in your Angular application. While HTML provides the structure, directives provide the **logic** that manipulates that structure or its appearance based on the state of your application.

This module covers the hierarchy of directives, how they differ from components, the built-in tools Angular provides out-of-the-box, and how they interact with data binding to create a seamless reactive experience.

[↑ Back to Table of Contents](#table-of-contents)
***

*Now that we understand the fundamental purpose of directives, let's look at where they fit into the broader Angular component architecture.*

## 2. Understanding Directives

Directives are the "instructions" you give to the DOM. They allow you to say, "If this condition is true, show this element," or "Apply this specific style to this button."

### 2.1 Directives vs Components

A common point of confusion for beginners is the relationship between a **Component** and a **Directive**. In Angular, a **Component** is actually a **Directive** with a template.

| Feature | Directive | Component |
| :--- | :--- | :--- |
| **Template (HTML)** | No. It only manipulates existing elements. | **Yes.** It defines its own view/UI. |
| **Usage** | Attached to an existing HTML element as an attribute. | Used as a custom HTML tag (e.g., `<app-user>`). |
| **Purpose** | To add specific behavior or change the look of an element. | To create a self-contained, reusable UI building block. |
| **Analogy** | A "modifier" (e.g., making a text blue). | A "Lego Brick" (e.g., a whole dashboard widget). |

**Summary:** Think of a **Component** as the *container* of your UI, and **Directives** as the *decorators* or *behaviors* applied to the parts of that UI.

[↑ Back to Table of Contents](#table-of-contents)
***

*If components are the building blocks, then built-in directives are the standard tools provided by Angular to help you manipulate those blocks without writing custom code every time.*

## 3. Built-in Directives

Angular provides a robust set of built-in directives to handle the most common UI tasks. These are categorized into **Structural** (which change the DOM layout) and **Attribute** (which change the appearance or behavior of an element).

### 3.1 Structural Directives & The New Control Flow

**Structural Directives** are responsible for adding, removing, or replacing elements in the DOM. Traditionally, these are identified by the asterisk (`*`) prefix. However, starting with Angular 17, a new, more performant **Built-in Control Flow** syntax was introduced to replace them.

#### The Evolution: Legacy vs. New

The shift from attribute-based directives to block-based control flow represents a major architectural improvement in Angular.

| Feature | Legacy Structural Directives (`*`) | New Control Flow (`@`) |
| :--- | :--- | :--- |
| **Syntax Style** | Attribute-based (e.g., `*ngIf="..."`) | Block-based (e.g., `@if (...) { ... }`) |
| **Performance** | Slightly higher overhead due to micro-syntax parsing. | **Highly optimized**; built directly into the compiler. |
| **Readability** | Can become "nested hell" with multiple `*ngIf` and `*ngFor`. | Much cleaner; looks like standard JavaScript/TypeScript. |
| **Complexity** | Requires importing `CommonModule` or specific directives. | **Zero imports required**; part of the core language. |

#### Comparison: Implementation Examples

**1. Conditional Rendering**

*   **Legacy (`*ngIf`):**
    ```html
    <div *ngIf="isLoggedIn; else loggedOut">
      Welcome back!
    </div>
    <ng-template #loggedOut>
      Please log in.
    </ng-template>
    ```
*   **New (`@if`):**
    ```html
    @if (isLoggedIn) {
      <div>Welcome back!</div>
    } @else {
      <div>Please log in.</div>
    }
    ```

**2. Iteration (`*ngFor` vs `@for`)**

The new `@for` loop is significantly more powerful because it enforces a `track` property, which is essential for DOM performance.

*   **Legacy (`*ngFor`):**
    ```html
    <li *ngFor="let item of items; trackBy: trackById">
      {{ item.name }}
    </li>
    ```
*   **New (`@for`):**
    ```html
    @for (item of items; track item.id) {
      <li>{{ item.name }}</li>
    } @empty {
      <li>No items found!</li>
    }
    ```
    > [!TIP]
    > The **`@empty`** block is a massive ergonomic win, allowing you to handle "no data" states directly within the loop logic without a separate `*ngIf`.

**3. Switching Logic**

*   **Legacy (`*ngSwitch`):** Uses a combination of `[ngSwitch]`, `*ngSwitchCase`, and `*ngSwitchDefault`.
    ```html
    <div [ngSwitch]="userRole">
        <p *ngSwitchCase="'admin'">You have full access.</p>
        <p *ngSwitchCase="'editor'">You can edit content.</p>
        <p *ngSwitchDefault>Please contact support.</p>
    </div>
    ```
*   **New (`@switch`):**
    ```html
    @switch (userRole) {
      @case ('admin') { <admin-dashboard /> }
      @case ('editor') { <editor-panel /> }
      @default { <viewer-mode /> }
    }
    ```

[↑ Back to Table of Contents](#table-of-contents)
***

### 3.2 Attribute Directives

**Attribute Directives** do not change the structure of the DOM (they don't add or remove elements). Instead, they "decorate" existing elements by changing their appearance, behavior, or CSS properties.

#### Common Built-in Attribute Directives

| Directive | Purpose | Typical Use Case |
| :--- | :--- | :--- |
| **`ngClass`** | Dynamically adds/removes CSS classes. | Toggling an `.active` or `.error` class based on state. |
| **`ngStyle`** | Dynamically applies inline CSS styles. | Changing the width of a progress bar or color of a status dot. |
| **`ngModel`** | Implements two-way data binding. | Syncing an `<input>` field value with a component variable. |

---

#### Implementation Examples

**1. Dynamic Styling with `ngClass`**

Instead of manually toggling strings, `ngClass` accepts an object where the **key** is the class name and the **value** is the boolean condition.

```html
<!-- The 'highlight' class is only applied if 'isImportant' is true -->
<div [ngClass]="{ 'highlight': isImportant, 'text-muted': !isImportant }">
  This text changes style based on importance.
</div>
```

**2. Inline Control with `ngStyle`**

Use `ngStyle` when a style value is calculated dynamically (e.g., coming from a database or a math operation) and cannot be easily predefined in a CSS file.

```html
<!-- The width is driven directly by the 'progress' variable in TypeScript -->
<div class="progress-bar" 
     [ngStyle]="{ 'width': progress + '%', 'background-color': statusColor }">
</div>
```

**3. Two-Way Binding with `ngModel`**

`ngModel` is the bridge that allows data to flow in both directions: from the Component $\rightarrow$ View, and from the View $\rightarrow$ Component.

*Note: This requires importing **`FormsModule`** in your component or module.*

```html
<!-- When the user types, the 'username' variable updates instantly -->
<!-- If the code changes 'username', the input text updates instantly -->
<input [(ngModel)]="username" placeholder="Enter your name">

<p>Hello, {{ username }}!</p>
```

> [!IMPORTANT]
> **Attribute vs. Structural:** Always ask yourself: *"Am I changing what is **on** the page (Attribute) or how much is **in** the page (Structural)?"* If you are adding/removing elements, you must use the structural syntax.

[↑ Back to Table of Contents](#table-of-contents)
***

*Understanding how these directives change the DOM is one thing, but the real power emerges when we connect them to the data living inside our TypeScript classes.*

## 4. Data Binding and Directives

The true magic of Angular happens at the intersection of **Directives** and **Data Binding**. Directives act as the bridge between your logic (the TypeScript) and your view (the HTML).

### 4.1 The Binding Taxonomy

To understand how directives interact with your data, you must distinguish between the three primary types of data binding.

| Binding Type | Syntax | Direction | Purpose in Directives |
| :--- | :--- | :--- | :--- |
| **Property Binding** | `[target]="value"` | Component $\rightarrow$ View | Tells a directive *what* value to act upon (e.g., `[ngClass]`). |
| **Event Binding** | `(event)="handler()"` | View $\rightarrow$ Component | Allows directives to trigger logic in response to user input. |
| **Two-Way Binding** | `[(target)]="value"` | Component $\leftrightarrow$ View | Synchronizes a directive and a variable perfectly (e.g., `[(ngModel)]`). |

**The Reactive Connection:**

Directives rely on these bindings to know *when* and *how* to change.

1.  **Property Binding**: Directives use this to "listen" to your component data. For example, `[ngClass]="{'active': isActive}"` uses property binding to tell the `ngClass` directive to check the `isActive` variable.
2.  **Event Binding**: While directives primarily change the UI, they often trigger or respond to events that drive the data binding cycle.
3.  **Two-Way Binding**: This is the ultimate synergy. A directive (`ngModel`) uses both property and event binding to ensure that the UI and the component data are always perfectly synchronized.

**The Flow of Logic:**
`Component Data` $\rightarrow$ `Data Binding` $\rightarrow$ `Directive` $\rightarrow$ `DOM Change`

**Example Scenario:**
Imagine a shopping list.
- The **Data** is an array of items in your TypeScript.
- The **Directive** (`@for`) reads that array.
- The **Data Binding** (`{{ item.name }}`) tells the directive what text to put inside each new list element.

[↑ Back to Table of Contents](#table-of-contents)
***

*While built-in directives cover most common use cases, you will often encounter scenarios where you need specialized logic that isn't provided by default. This is where you step in to create your own.*

## 5. Creating Custom Directives

When standard directives aren't enough, you can build your own using the `@Directive` decorator. Custom directives typically fall into two categories: **Attribute** (changing look/behavior) or **Structural** (changing DOM layout).

### 5.1 Building an Attribute Directive

Let's say we want a directive called `appHighlight` that changes an element's background color when the user hovers over it.

**Step 1: Generate the Directive**
Using the Angular CLI:
```bash
ng generate directive highlight
```

**Step 2: Implement the Logic**
In your `highlight.directive.ts`, you use `ElementRef` to access the DOM element and the `host` object in the `@Directive` decorator to listen to events like `mouseenter` and `mouseleave`.

```typescript
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class HighlightDirective {
  // We can allow the user to pass a custom color via an input
  @Input() appHighlight = 'yellow';

  constructor(private el: ElementRef) {}

  onMouseEnter() {
    this.setHighlight(this.appHighlight);
  }

  onMouseLeave() {
    this.setHighlight(null);
  }

  private setHighlight(color: string | null) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

**Step 3: Use it in a Template**
First, ensure the directive is imported into your Component's `imports` array, then apply it like an attribute:

```html
<!-- Uses the default 'yellow' color -->
<p appHighlight>Hover over me to see the highlight!</p>

<!-- Passes a custom 'cyan' color via property binding -->
<p [appHighlight]="'cyan'">Hover over me for cyan!</p>
```

### 5.2 Building a Structural Directive

Structural directives are more complex because they don't just manipulate an element—they manipulate the *container* of the element. To create one, you must inject `TemplateRef` (the content to show) and `ViewContainerRef` (the place to show it).

**The Pattern:**
1.  **`TemplateRef`**: Represents the `<ng-template>` block you want to render.
2.  **`ViewContainerRef`**: Acts as the container where you can programmatically insert or remove the template.

#### Example: A Custom `appIf` Directive
Here is a basic implementation of a conditional structural directive:

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appIf]',
  standalone: true
})
export class IfDirective {
  // Track whether the template is currently rendered to avoid redundant DOM operations
  private hasView = false;

  constructor(
    // TemplateRef: Provides access to the content inside the *appIf block
    private templateRef: TemplateRef<any>,
    // ViewContainerRef: Provides the anchor point to attach/detach the template in the DOM
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appIf(condition: boolean) {
    if (condition && !this.hasView) {
      /**
       * CASE 1: Condition is true and we haven't rendered yet.
       * createEmbeddedView() takes the TemplateRef and injects it into 
       * the ViewContainerRef (the location of the directive).
       */
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      /**
       * CASE 2: Condition is false but the view is still present.
       * clear() removes all embedded views from this container, 
       * effectively "removing" the element from the DOM.
       */
      this.viewContainer.clear();
      this.hasView = false;
    }
    // CASE 3: If condition is true and already hasView, or false and already cleared, do nothing.
  }
}
```

**Usage:**
```html
<div *appIf="isLoggedIn">
  Welcome back, User!
</div>
```

> [!NOTE]
> For most application development, **Attribute directives** are sufficient. **Structural directives** are typically reserved for library authors or complex layout engines.
