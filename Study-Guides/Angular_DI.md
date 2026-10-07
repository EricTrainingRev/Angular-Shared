# Architecture & Dependency Injection

## Table of Contents

* [1. High-Level Overview](#1-high-level-overview)
* [2. Dependency Injection (DI)](#2-dependency-injection-di)
    * [2.1 What is Dependency Injection?](#21-what-is-dependency-injection)
    * [2.2 The Problem: Tight Coupling](#22-the-problem-tight-coupling)
    * [2.3 The Solution: Inversion of Control (IoC)](#23-the-solution-inversion-of-control-ioc)
* [3. DI Providers in Angular](#3-di-providers-in-angular)
    * [3.1 Understanding Providers](#31-understanding-providers)
    * [3.2 Provider Types (The Hierarchical View)](#32-provider-types-the-hierarchical-view)
    * [3.3 Provider Patterns: `useClass` vs. `useValue` vs. `useExisting`](#33-provider-patterns-useclass-vs-usevalue-vs-useexisting)
* [4. Services](#4-services)
    * [4.1 The Role of Services](#41-the-role-of-services)
    * [4.2 Singleton vs. Component-Level Services](#42-singleton-vs-component-level-services)

***

## 1. High-Level Overview

In modern software architecture, particularly within frameworks like **Angular**, managing how different parts of an application interact is critical for scalability and testability. This module explores the concept of **Dependency Injection (DI)**—a design pattern that allows a class to receive its dependencies from an external source rather than creating them itself. 

We will traverse from the theoretical foundations of **Inversion of Control (IoC)** to the concrete implementation of **Providers** and the practical utilization of **Services** within the Angular ecosystem.

[↑ Back to Table of Contents](#table-of-contents)

***

*Now that we have established the architectural goal of decoupling components, let's examine the specific problem DI is designed to solve.*

## 2. Dependency Injection (DI)

### 2.1 What is Dependency Injection?

**Dependency Injection** is a design pattern where an object (the "client") receives other objects that it requires (the "dependencies") from an external entity (the "injector") rather than instantiating them internally using the `new` keyword.

### 2.2 The Problem: Tight Coupling

Without DI, classes are responsible for creating their own dependencies. This leads to **Tight Coupling**, where a change in one class's constructor or implementation forces changes in every class that instantiates it.

**Example of Tight Coupling (The "Bad" Way):**
```typescript
// Without DI: This class is "stuck" with the specific Logger implementation.
class UserService {
  private logger = new FileLogger(); // Hardcoded dependency

  createUser() {
    this.logger.log('User created');
  }
}
```
**Consequences of Tight Coupling:**
*   **Difficult Testing:** You cannot easily swap `FileLogger` for a `MockLogger` during unit tests.
*   **Rigidity:** Changing the logger requires modifying every service that uses it.
*   **Complexity:** The `UserService` must know *how* to construct a `FileLogger` (including its own dependencies).

### 2.3 The Solution: Inversion of Control (IoC)

**Inversion of Control (IoC)** is the broader principle behind DI. Instead of the `UserService` controlling the creation of the logger, control is "inverted" to a central system (the Angular Injector).

**DI vs. IoC**
While often used interchangeably, they are distinct:
*   **IoC** is the *concept*: "Don't call us, we'll call you." It is the design principle of delegating control.
*   **DI** is the *pattern*: A specific way to implement IoC by "injecting" dependencies into a class.

[↑ Back to Table of Contents](#table-of-contents)

***

*Once we understand why we need to invert control, we must address how the framework actually manages the delivery of these dependencies: through **Providers**.*

## 3. DI Providers in Angular

### 3.1 Understanding Providers

In Angular, a **Provider** is a set of instructions that tells the **Injector** how to create or find an instance of a dependency. When you ask for a service in a constructor, Angular looks up the "recipe" provided by the provider to fulfill your request.

### 3.2 Provider Types (The Hierarchical View)

Angular uses a **Hierarchical Injection System**. The location where you "provide" a service determines its lifetime and visibility.

| Provider Level | Scope | Lifetime | Best Use Case |
| :--- | :--- | :--- | :--- |
| **Root (`providedIn: 'root'`)** | Application-wide (Singleton) | Entire app lifecycle | Most services (State, API, Auth) |
| **Module (`@NgModule`)** | Within a specific Feature Module | Module lifecycle | Shared services for a specific module |
| **Component (`@Component`)** | Local to the component and its children | Component lifecycle | UI state local to a specific view |

> [!IMPORTANT]
> **Moving Away from NgModules:** In modern Angular development, `NgModule` is no longer the primary way to organize or provide dependencies. The community and the Angular team have shifted toward **Standalone Components** and **Functional Providers**. Instead of declaring a service in a module, you should prefer `@Injectable({ providedIn: 'root' })` for singletons or providing them directly within the `bootstrapApplication` configuration for global app-level setup.

### 3.3 Provider Patterns

Angular offers different "recipes" for how to create a dependency. This allows for powerful polymorphism and testing capabilities.

| Pattern | Syntax | Behavior |
| :--- | :--- | :--- |
| **Class Provider** | `useClass` | Creates a new instance of a specific class. |
| **Value Provider** | `useValue` | Injects a static value or configuration object. |
| **Existing Provider** | `useExisting` | Creates an alias to an existing token (no new instance). |
| **Factory Provider** | `useFactory` | Uses a function to dynamically create a dependency. |

**Comparing Provider Patterns**

**`useClass` vs. `useValue`**
*   **`useClass`** is for **logic**. You are telling Angular: "When someone asks for `Logger`, give them a new `FileLogger` instance."
*   **`useValue`** is for **data/config**. You are telling Angular: "When someone asks for `API_CONFIG`, give them this literal object `{ url: '...' }`."

**Example: Swapping implementations for testing**
```typescript
// In your test configuration
providers: [
  { provide: Logger, useClass: MockLogger } // Swaps real Logger for MockLogger
]
```

[↑ Back to Table of Contents](#table-of-contents)

***

*With the mechanics of providers understood, let's look at the most common entity we actually inject into our application: the **Service**.*

## 4. Services

### 4.1 The Role of Services

A **Service** is a class with a narrow, specific purpose. In Angular, services are the primary way to share logic, data, and state across multiple components without duplicating code.

**Common Service Responsibilities:**
*   **Data Fetching:** Interacting with HTTP APIs.
*   **Business Logic:** Performing calculations or data transformations.
*   **State Management:** Holding the "source of truth" for the application's data.

### 4.2 Singleton vs. Component-Level Services

The behavior of a service depends entirely on its **Provider Scope**.

**1. Singleton Services (The Standard)**
By using `@Injectable({ providedIn: 'root' })`, the service becomes a **Singleton**.
*   **One Instance:** There is only one instance of the service for the entire application.
*   **Shared State:** If Component A changes a value in the service, Component B will see that change immediately.
*   **Memory Efficient:** The service is instantiated once (lazily) and reused.

**2. Component-Level Services (The Localized)**
By adding a service to a component's `providers: [...]` array, you create a **Component-Scoped** service.
*   **New Instance per Component:** Every time that component is created, a brand-new instance of the service is born.
*   **Isolated State:** Component A and Component B will each have their own independent version of the service.
*   **Automatic Cleanup:** When the component is destroyed, the service instance is also destroyed.

> [!TIP]
> **When to use Component-Scoped Services:** Use them when you have a complex UI component (like a Data Grid or a Dashboard) that needs its own internal state/logic which should not interfere with other parts of the app.

[↑ Back to Table of Contents](#table-of-contents)
