# TypeScript Core: Part 3

## Table of Contents

* [1. High-Level Overview](#1-high-level-overview)
* [2. Const Assertions (`as const`)](#2-const-assertions-as-const)
* [3. Type Guards](#3-type-guards)
* [4. Interface vs. Type](#4-interface-vs-type)
* [5. TSX (TypeScript XML)](#5-tsx-typescript-xml)
* [6. Readonly Interfaces](#6-readonly-interfaces)

***

## 1. High-Level Overview

This module covers advanced TypeScript patterns used to refine type precision, manage object immutability, and extend syntax for modern UI frameworks. We will explore how to move from broad, "widened" types to exact, literal types, how to prove types at runtime, and the architectural decisions between using **Interfaces** and **Types**.

[↑ Back to Table of Contents](#table-of-contents)
***

*Having established the objective of precision and safety, let's start with a fundamental tool for literal type precision: `as const`.*

## 2. Const Assertions (`as const`)

The `as const` assertion is a powerful tool used to tell the TypeScript compiler to treat an expression with maximum literal precision, preventing **Type Widening**.

### 2.1 How it Works

When you declare an object or array without `as const`, TypeScript "widens" the types. For example, a string property `name: "Alice"` is widened to `name: string` because TypeScript assumes you might change it later. `as const` stops this process.

| Feature | Standard Declaration | With `as const` |
| :--- | :--- | :--- |
| **Property Type** | Widened (e.g., `string`, `number`) | Literal (e.g., `"Alice"`, `8080`) |
| **Immutability** | Mutable (can be reassigned) | **Readonly** (all properties become `readonly`) |
| **Array Type** | Widened to `Type[]` | Narrowed to a **Readonly Tuple** |

### 2.2 Code Example

```typescript
// Without 'as const' (Widening)
const config = {
  port: 8080,
  mode: "development"
};
// type of config.port is number
// type of config.mode is string

// With 'as const' (Precision)
const strictConfig = {
  port: 8080,
  mode: "development"
} as const;

// type of strictConfig.port is exactly 8080
// type of strictConfig.mode is exactly "development"
// All properties are now 'readonly'
```

> [!TIP]
> `as const` is particularly useful when you want to create a union type from an array's values.

[↑ Back to Table of Contents](#table-of-contents)
***

*While `as const` provides compile-time precision, we often need to verify those types during actual code execution using Type Guards.*

## 3. Type Guards

**Type Guards** are mechanisms that allow you to narrow down the type of a variable within a specific logic branch. This bridges the gap between runtime reality and compile-time assumptions.

### 3.1 Common Guarding Mechanisms

| Mechanism | Best Use Case | Example |
| :--- | :--- | :--- |
| **`typeof`** | Checking primitive types | `if (typeof val === "string")` |
| **`instanceof`** | Checking class instances | `if (err instanceof Error)` |
| **`in` operator** | Checking for property existence | `if ("id" in user)` |
| **User-Defined Guards** | Complex, custom logic | `function isUser(obj: any): obj is User` |

### 3.2 User-Defined Type Guards

For complex logic, you can create a function that returns a **Type Predicate** (`parameterName is Type`).

```typescript
interface Bird { fly: () => void }
interface Fish { swim: () => void }

function isFish(pet: Bird | Fish): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Bird | Fish) {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows 'pet' is Fish here
  } else {
    pet.fly();  // TypeScript knows 'pet' is Bird here
  }
}
```

> [!IMPORTANT]
> Type guards provide **runtime validation**. Without a type guard, you might assume a variable is a certain type, but if the actual data coming from an API is different, your code will crash at runtime.

[↑ Back to Table of Contents](#table-of-contents)
***

*Now that we know how to narrow types, we must decide which structure to use when defining them: the Interface or the Type Alias.*

## 4. Interface vs. Type

One of the most frequent points of confusion in TypeScript is deciding between `interface` and `type`. While they often overlap, they serve different architectural purposes.

### 4.1 Comparative Analysis

| Feature | `interface` | `type` |
| :--- | :--- | :--- |
| **Declaration Merging** | ✅ **Supported** (can extend via re-declaration) | ❌ **Not supported** |
| **Unions & Intersections** | ❌ Cannot represent unions directly | ✅ **Native support** (e.g., `type Status = "on" \| "off"`) |
| **Primitives & Tuples** | ❌ Cannot be used for primitives | ✅ **Can represent** primitives, unions, and tuples |
| **Extending Syntax** | Uses `extends` keyword | Uses `&` (Intersection) |

### 4.2 When to Use Which?

**Use `interface` when:**
* You are defining the "shape" of an object or a class.
* You are building a public API where users might want to use **Declaration Merging** to add properties.
* You prefer the slightly better error messages and performance optimizations provided by the TS compiler for interfaces.

**Use `type` when:**
* You need to define a **Union Type** (e.g., `type ID = string | number`).
* You are defining a **Tuple** or a primitive alias.
* You are performing complex type transformations (Mapped Types, Conditional Types).

[↑ Back to Table of Contents](#table-of-contents)
***

*Defining the structure is one thing, but in modern development, we often need to describe how that structure appears in our UI markup via TSX.*

## 5. TSX (TypeScript XML)

**TSX** is the TypeScript equivalent of JSX (used in React). It allows you to write HTML-like syntax directly within your TypeScript files.

### 5.1 Key Requirements

* **File Extension:** You **must** use the `.tsx` extension. A standard `.ts` file will interpret the `<` character as a "less than" operator or the start of a generic, leading to syntax errors.
* **Context:** Primarily used in environments like React, Preact, or SolidJS.

### 5.2 The Ambiguity Problem

In a standard `.ts` file, the following is valid:
```typescript
const element = <T>(arg: T) => arg; // Generic function
```

In a `.tsx` file, the compiler might confuse `<T>` with an unclosed HTML tag. This is why explicit file extensions and strict linting are critical when working with TSX.

[↑ Back to Table of Contents](#table-of-contents)
***

*Finally, to ensure the data structures we've defined remain stable and unchangeable throughout our application lifecycle, we utilize Readonly Interfaces.*

## 6. Readonly Interfaces

To prevent accidental mutation of object properties, TypeScript provides the `readonly` modifier. This is a key component of defensive programming.

### 6.1 Implementation

You can apply `readonly` to individual properties within an interface to ensure they are set during initialization but never changed afterward.

```typescript
interface Configuration {
  readonly apiKey: string;
  readonly endpoint: string;
  timeout: number; // Mutable
}

const config: Configuration = {
  apiKey: "secret_123",
  endpoint: "https://api.example.com",
  timeout: 5000
};

// ❌ Error: Cannot assign to 'apiKey' because it is a read-only property.
config.apiKey = "new_key"; 

// ✅ Allowed
config.timeout = 3000;
```

> [!WARNING]
> **Compile-time only:** The `readonly` modifier is a TypeScript feature. Once the code is compiled to JavaScript, the `readonly` constraint is stripped away. It provides safety during development, but does not prevent a malicious user from changing the property at runtime in the browser.

[↑ Back to Table of Contents](#table-of-contents)
