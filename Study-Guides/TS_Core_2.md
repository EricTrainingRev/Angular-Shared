# TypeScript Core Part 2

## Table of Contents

* [1. High-Level Overview](#1-high-level-overview)
* [2. Type System Enhancements](#2-type-system-enhancements)
    * [2.1 Casting (Type Assertions)](#21-casting-type-assertions)
    * [2.2 Classes](#22-classes)
    * [2.3 Basic Generics](#23-basic-generics)
* [3. Advanced Type Manipulation](#3-advanced-type-manipulation)
    * [3.1 Utility Types](#31-utility-types)
    * [3.2 Keyof Operator](#32-keyof-operator)
    * [3.3 Decorators](#33-decorators)
* [4. Functional TypeScript](#4-functional-typescript)
    * [4.1 Functions](#41-functions)

***

## 1. High-Level Overview

In Part 1 of our TypeScript journey, we covered the fundamental types and basic interface structures. In **TypeScript Core Part 2**, we move beyond simple type definitions and into the mechanisms that make TypeScript a powerful tool for building scalable, enterprise-grade applications. 

This module explores how to manipulate types dynamically, how to structure object-oriented code using **Classes**, and how to create reusable logic via **Generics** and **Utility Types**. We will also touch upon the metadata-driven world of **Decorators** and the nuances of typing **Functions**.

[↑ Back to Table of Contents](#table-of-contents)
***

*Having established the high-level roadmap, let's dive into the first mechanism for telling the compiler exactly what we know about our data: Casting.*

## 2. Type System Enhancements

### 2.1 Casting (Type Assertions)

**Casting**, more formally known as **Type Assertions**, is a way to tell the TypeScript compiler: *"I know more about the type of this object than you do."* It does **not** perform any runtime transformation (like actual casting in C# or Java); it is purely a compile-time instruction to the type checker.

| Method | Syntax | Usage |
| :--- | :--- | :--- |
| **`as` Syntax** | `value as Type` | The most common and recommended way, especially in JSX/React environments. |
| **Angle-bracket Syntax** | `<Type>value` | The older syntax. **Cannot** be used in `.tsx` files because it conflicts with JSX. |

**Example:**
```typescript
let someValue: unknown = "this is a string";

// We use 'as' to assert that 'someValue' is a string
let strLength: number = (someValue as string).length;
```

> [!WARNING]
> **The "Liar" Risk:** Type assertions are purely compile-time instructions. If you assert a variable is a `string` when it is actually a `number`, TypeScript will not catch the error. At runtime you'll get a wrong result — accessing a string-only property like `.length` returns `undefined`, and calling a string-only method like `.toUpperCase()` will throw.

[↑ Back to Table of Contents](#table-of-contents)
***

*While casting allows us to refine types for existing values, Classes allow us to define the blueprints for complex, stateful objects.*

### 2.2 Classes

**Classes** in TypeScript are a superset of JavaScript classes. They provide a way to implement object-oriented programming (OOP) patterns, including encapsulation, inheritance, and **polymorphism**, while adding strict type safety to member variables and methods.

**Key Features:**
* **Access Modifiers:** Control the visibility of class members.
* **Readonly Properties**: Prevent properties from being changed after initialization.
* **Constructor Parameters**: A shorthand way to declare and initialize members.

#### Access Modifiers: A Comparison

| Modifier | Visibility | Description |
| :--- | :--- | :--- |
| **`public`** (default) | Everywhere | The member is accessible from anywhere. |
| **`private`** | Inside the Class | The member is accessible **only** within the class it is defined in. |
| **`protected`** | Class & Subclasses | The member is accessible within the class and any classes that **inherit** from it. |

**Implementation Example:**
```typescript
class Employee {
    // Shorthand: declaring 'private' in the constructor 
    // automatically creates and assigns the property.
    constructor(
        public name: string, 
        private salary: number,
        protected department: string
    ) {}

    getDetails(): string {
        return `${this.name} works in ${this.department}`;
    }
}

class Manager extends Employee {
    getManagerInfo() {
        // Can access protected member 'department'
        return `${this.name} manages ${this.department}`;
    }
}

> [!TIP]
> Use **`protected`** when you want to hide a property from the outside world but allow subclasses to use it for internal logic. Use **`private`** only when you want to strictly limit access to the defining class itself.

const emp = new Employee("Alice", 50000, "Engineering");
console.log(emp.name);        // ✅ OK (public)
// console.log(emp.salary);   // ❌ Error (private)
// console.log(emp.department); // ❌ Error (protected)
```

[↑ Back to Table of Contents](#table-of-contents)
***

*Classes provide structure for individual objects, but to build truly flexible and reusable code, we need to move from specific types to abstract patterns using Generics.*

### 2.3 Basic Generics

**Generics** are the "variables for types." They allow you to create components (functions, interfaces, or classes) that work over a variety of types rather than a single one, while still maintaining strict type safety.

Instead of using `any` (which loses all type information), Generics use a **Type Parameter** (conventionally `<T>`) to capture the type provided by the user.

**Generic Function Example:**
```typescript
// Without Generics (using any)
function identityAny(arg: any): any {
    return arg;
}

// With Generics (maintaining type connection)
function identity<T>(arg: T): T {
    return arg;
}

const output1 = identity<string>("Hello"); // Explicitly setting T to string
const output2 = identity(42);             // Type inference: T is automatically number
```

> [!TIP]
> If you use `any`, the relationship between input and output is lost. If you pass a `number` into `identityAny`, TypeScript thinks the result could be anything. If you pass a `number` into `identity<T>`, TypeScript knows for a fact that the result is a `number`.

[↑ Back to Table of Contents](#table-of-contents)
***

*Generics allow us to create flexible blueprints; Utility Types allow us to take existing types and transform them into new, more specific shapes.*

## 3. Advanced Type Manipulation

### 3.1 Utility Types

TypeScript provides a set of built-in **Utility Types** to perform common type transformations. These are essential for keeping your code DRY (Don't Repeat Yourself) and managing complex data structures.

| Utility Type | Purpose | Example Usage |
| :--- | :--- | :--- |
| **`Partial<T>`** | Makes all properties in `T` optional. | `Partial<User>` |
| **`Required<T>`** | Makes all properties in `T` required. | `Required<User>` |
| **`Readonly<T>`** | Makes all properties in `T` immutable. | `Readonly<User>` |
| **`Pick<T, K>`** | Creates a type by picking a set of properties `K` from `T`. | `Pick<User, 'id' \| 'name'>` |
| **`Omit<T, K>`** | Creates a type by removing a set of properties `K` from `T`. | `Omit<User, 'password'>` |

**Example: Transforming a User Interface**
```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// 1. Create a type for updating a user (all fields optional)
type UserUpdateInput = Partial<User>;

// 2. Create a type for a public profile (remove sensitive data)
type PublicUserProfile = Omit<User, 'password'>;

// 3. Create a type for a simple identifier (only pick specific fields)
type UserIdentifier = Pick<User, 'id' | 'email'>;
```

[↑ Back to Table of Contents](#table-of-contents)
***

### 3.2 Keyof Operator
The **`keyof`** operator takes an object type and produces a string or numeric literal union of its keys. It is a powerful way to ensure that a value is a valid property name of a specific type.

**Example:**
```typescript
interface Car {
    make: string;
    model: string;
    year: number;
}

// type CarKeys = "make" | "model" | "year"
type CarKeys = keyof Car;

function getProperty(car: Car, key: CarKeys) {
    return car[key];
}

const myCar: Car = { make: "Toyota", model: "Corolla", year: 2022 };

getProperty(myCar, "make");  // ✅ OK
// getProperty(myCar, "color"); // ❌ Error: "color" is not a key of Car
```

| Feature | **Utility Types** | **`keyof` Operator** |
| :--- | :--- | :--- |
| **Primary Role** | **Transformation** | **Selection** |
| **Mechanism** | Takes an existing type and creates a *new* type by adding/removing/modifying properties. | Takes an existing type and extracts a union of its *existing* property names. |
| **Analogy** | Like a filter or a re-formatter for a document. | Like a list of all the chapter titles in a book. |

[↑ Back to Table of Contents](#table-of-contents)
***

*Now that we can manipulate types and keys, let's look at how we can attach extra logic to our classes and properties using Decorators.*

### 3.3 Decorators

**Decorators** are a special kind of declaration that can be attached to a class, method, accessor, property, or parameter. They use the `@expression` form and are essentially functions that receive the thing they are decorating as an argument.

> [!IMPORTANT]
> **Configuration Required:** To use decorators, you must enable `"experimentalDecorators": true` in your `tsconfig.json`.

Decorators are widely used in frameworks like **Angular** or **NestJS** for dependency injection, logging, and routing.

**Common Types of Decorators:**
1.  **Class Decorators:** Used to observe, modify, or replace a class definition.
2.  **Method Decorators:** Used to intercept method calls (e.g., for logging or validation).
3.  **Property Decorators:** Used to add metadata to a specific property.

**Example: A Simple Logging Decorator**
```typescript
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyKey} with arguments:`, args);
        return originalMethod.apply(this, args);
    };
}

class Calculator {
    @Log
    add(a: number, b: number) {
        return a + b;
    }
}

const calc = new Calculator();
calc.add(5, 10); // Logs: "Calling add with arguments: [5, 10]"
```

[↑ Back to Table of Contents](#table-of-contents)
***

*Finally, we wrap up our core module by looking at how to apply all these concepts to the most common structure in code: Functions.*

## 4. Functional TypeScript

### 4.1 Functions

Typing functions correctly is critical for ensuring that data flows through your application without errors. TypeScript allows you to define the types of parameters, the return type, and even the **function signatures** in specific contexts.

#### 1. Basic Function Typing
The simplest way to type a function is to define the types for its arguments and its return value.

```typescript
function multiply(a: number, b: number): number {
    return a * b;
}
```

#### 2. Function Type Expressions
Sometimes you want to define a type that describes a function's signature so it can be passed as a variable or a callback.

```typescript
// Define the shape of a callback function
type Callback = (data: string) => void;

function processData(input: string, cb: Callback) {
    cb(input.toUpperCase());
}

processData("hello", (msg) => console.log(msg)); // ✅ OK
```

#### 3. Optional and Default Parameters
TypeScript allows you to mark parameters as optional using the `?` symbol or provide default values.

```typescript
function greet(name: string, greeting?: string): string {
    return `${greeting || "Hello"}, ${name}`;
}

function logMessage(message: string, level: string = "INFO"): void {
    console.log(`[${level}] ${message}`);
}
```

#### 4. Function Overloads
When a function can be called in multiple ways with different parameter types or counts, you can use **Function Overloads** to provide specific signatures for each case.

```typescript
// Overload signatures
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;

// The actual implementation (must be compatible with all signatures)
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
    if (d !== undefined && y !== undefined) {
        return new Date(y, mOrTimestamp, d);
    } else {
        return new Date(mOrTimestamp);
    }
}

const d1 = makeDate(12345678); // ✅ OK
const d2 = makeDate(5, 5, 2023); // ✅ OK
// const d3 = makeDate(5, 5);    // ❌ Error: No overload matches this call
```

[↑ Back to Table of Contents](#table-of-contents)
