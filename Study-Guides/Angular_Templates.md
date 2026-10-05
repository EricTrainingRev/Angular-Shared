# Angular Templates

## Table of Contents

* [1. High-Level Overview](#1-high-level-overview)
* [2. Templates](#2-templates)
* [3. Template Statements](#3-template-statements)
* [4. Template Reference Variables](#4-template-reference-variables)
* [5. Content Projection](#5-content-projection)

***

## 1. High-Level Overview

In Angular, the **View** is the visual representation of your application's state. While the TypeScript component class handles the logic and data (the **Model**), the **Template** is the mechanism that defines how that data is presented to the user in the browser. 

Angular templates are written using **HTML** enhanced with special Angular-specific syntax. This syntax allows you to bridge the gap between your static HTML structure and your dynamic TypeScript logic, enabling a reactive user interface.

[↑ Back to Table of Contents](#table-of-contents)
***

*Now that we have established the role of templates in the MVC architecture, let's dive into the specific syntax and types of templates used in Angular.*

## 2. Templates

An Angular template can be defined in two primary ways: **Inline** or **External**. The choice between them usually depends on the complexity and size of the component's view.

### 2.1 Template Types

| Type | Definition | Use Case |
| :--- | :--- | :--- |
| **External Template** | A separate `.html` file linked to a component via the `templateUrl` property. | The **standard** for most components; keeps HTML and logic strictly separated and manageable. |
| **Inline Template** | HTML code written directly inside the component's `@Component` decorator using the `template` property. | Best for **very small**, simple components where a separate file would be unnecessary overhead. |

### 2.2 The Template-Component Link

A component and its template are tied together through the `@Component` decorator.

**Example: External Template**
```typescript
// user.component.ts
@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html', // Points to an external file
  styleUrls: ['./user.component.css']
})
export class UserComponent { ... }
```

**Example: Inline Template**
```typescript
// simple.component.ts
@Component({
  selector: 'app-simple',
  standalone: true,
  template: `<h1>Hello {{ name }}!</h1>` // HTML is defined directly in the string
})
export class SimpleComponent {
  name = 'Angular User';
}
```

[↑ Back to Table of Contents](#table-of-contents)
***

*While templates define the structure, they are static without a way to interact with the component class. This brings us to Template Statements, which allow us to bridge the gap from View to Logic.*

## 3. Template Statements

**Template Statements** are expressions embedded within the template that allow you to perform actions, such as responding to user events or updating component properties. They are the "glue" that makes your UI interactive.

### 3.1 Event Bindings

The most common use of template statements is **Event Binding**. This allows you to listen for user actions (like clicks, keystrokes, or mouse movements) and trigger methods defined in your TypeScript class.

**Syntax:** `(event)="statement"`

```html
<!-- When the button is clicked, call the handleClick() method in the component -->
<button (click)="handleClick()">Click Me!</button>

<!-- Capturing a keyup event and passing the event object -->
<input (keyup)="onKeyUp($event)" placeholder="Type something...">
```

### 3.2 Interpolation vs. Property Binding

It is important to distinguish between showing data and setting properties.

| Concept | Syntax | Primary Purpose | Example |
| :--- | :--- | :--- | :--- |
| **Interpolation** | `{{ value }}` | To render text/data into the HTML structure. | `<p>Welcome, {{ username }}</p>` |
| **Property Binding** | `[property]="value"`| To set a specific attribute or property of a DOM element. | `<img [src]="imageUrl">` |

> [!IMPORTANT]
> **Interpolation vs. Property Binding:** While you *can* sometimes use interpolation to set properties (e.g., `src="{{ imageUrl }}"`), **Property Binding** is the preferred and more powerful method, especially when the value being passed is not a simple string (like a boolean or an object).

[↑ Back to Table of Contents](#table-of-contents)
***

*Event bindings let us send data to the component. However, sometimes we need to grab a reference to an element within the template itself to interact with it directly. This is where Template Reference Variables come in.*

## 4. Template Reference Variables

A **Template Reference Variable** is a local variable that allows you to access a specific DOM element or an Angular component/directive directly within the template. This is incredibly useful for reading values from inputs or passing an element into a function without needing to bind it to a class property first.

**Syntax:** `#variableName`

### 4.1 Accessing DOM Elements

By placing `#name` on an element, you can pass that entire element as an argument to a template statement.

```html
<!-- The #phone variable holds a reference to the input element -->
<input #phone placeholder="Enter phone number">

<!-- We pass the 'phone' variable (the element itself) to the function -->
<button (click)="callPhone(phone.value)">Call</button>
```

### 4.2 Accessing Components/Directives

You can also use a reference variable to access the public properties and methods of an Angular component or a directive.

```html
<!-- #timer is a reference to the TimerComponent instance -->
<app-timer #timer></app-timer>

<p>Current Time: {{ timer.currentTime }}</p>
<button (click)="timer.reset()">Reset Timer</button>
```

> [!TIP]
> Use Template Reference Variables sparingly. While they are powerful for simple interactions, if you find yourself using too many of them, it is often a sign that the logic should be moved into the TypeScript component class for better testability and separation of concerns.

[↑ Back to Table of Contents](#table-of-contents)
***

*We have covered how to display data and interact with elements. Now, let's look at a more advanced architectural pattern: Content Projection, which allows you to create highly reusable and flexible component structures.*

## 5. Content Projection

**Content Projection** is a pattern that allows you to "insert" or "project" HTML content from a parent component into a specific location within a child component. This is the mechanism that makes Angular components truly reusable, acting much like the `<slot>` element in Web Components.

Without content projection, a component would have a fixed, rigid structure. With it, a component can act as a "wrapper" or "container" that adapts to whatever content the user provides.

### 5.1 The `<ng-content>` Directive

The primary tool for content projection in Angular is the `<ng-content>` directive. When you place `<ng-content></ng-content>` inside a component's template, you are telling Angular: *"Put whatever the user puts between my selector tags right here."*

**Example: A Simple Card Component**

**1. The Child Component (The Container)**
```typescript
// card.component.ts
@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card-container">
      <div class="card-header">
        <!-- Slot for the header -->
        <ng-content select="[card-header]"></ng-content>
      </div>
      <div class="card-body">
        <!-- Default slot for all other content -->
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card-container { border: 1px solid #ccc; padding: 1rem; }
    .card-header { font-weight: bold; border-bottom: 1px solid #eee; }
  `]
})
export class CardComponent {}
```

**2. The Parent Component (The Consumer)**
```html
<!-- Using the CardComponent and projecting different content into it -->
<app-card>
  <h2 card-header>User Profile</h2> <!-- Projects into the [card-header] slot -->
  
  <p>Name: John Doe</p>            <!-- Projects into the default <ng-content> -->
  <p>Role: Administrator</p>       <!-- Projects into the default <ng-content> -->
</app-card>
```

### 5.2 Multi-Slot Projection (Using Selectors)

As seen in the example above, you don't have to limit yourself to a single "catch-all" slot. By using the `select` attribute on `<ng-content>`, you can create **Multiple Slots**.

| Selection Method | Syntax | Description |
| :--- | :--- | :--- |
| **Tag Name** | `select="h1"` | Projects elements that are `<h1>` tags. |
| **CSS Attribute** | `select="[card-header]"` | Projects elements that have the `card-header` attribute. |
| **CSS Class** | `select=".header"` | Projects elements that have the `header` class. |

**Summary of Projection Types:**

| Feature | Unassigned/Single Slot | Multi-Slot (Select) |
| :--- | :--- | :--- |
| **Complexity** | Very Low | Moderate |
| **Flexibility** | Low (one location for all) | High (targeted locations) |
| **Common Use** | Simple wrappers (e.g., a layout box) | Complex UI components (Cards, Modals, Tabs) |

> [!WARNING]
> **Content Projection vs. Input Properties:** A common mistake is trying to pass complex HTML structures via `@Input()` properties. This is difficult and inefficient. If you need to pass a block of UI, always use **Content Projection** via `<ng-content>`.

[↑ Back to Table of Contents](#table-of-contents)
