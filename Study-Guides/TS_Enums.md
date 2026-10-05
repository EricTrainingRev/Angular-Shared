# TypeScript Enums

## Table of Contents

* [1. High-Level Overview](#1-high-level-overview)
* [2. Numeric Enums](#2-numeric-enums)
* [3. String Enums](#3-string-enums)
* [4. Comparison: Numeric vs. String Enums](#4-comparison-numeric-vs-string-enums)

***

## 1. High-Level Overview

In TypeScript, an **Enum** (short for Enumeration) is a way to define a set of named constants. Under the hood, enums compile to plain JavaScript objects, but in your code you reference them as named members, which makes your code more readable, self-documenting, and less prone to errors caused by "magic strings" or arbitrary numbers.

Instead of using raw values like `0`, `1`, or `"admin"`, we can use meaningful names like `UserRole.Admin` or `Status.Active`. This provides a single source of truth and improves type safety across our application.

[↑ Back to Table of Contents](#table-of-contents)

***

*Now that we understand the purpose of enums, let's dive into the most common type: Numeric Enums.*

## 2. Numeric Enums

**Numeric Enums** are the default type of enum in TypeScript. They assign a number to every member of the enum, starting from `0` by default.

### 2.1 Default Initialization
If you don't provide explicit values, TypeScript auto-increments the numbers starting from zero.

```typescript
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

console.log(Direction.Up); // Output: 0
```

### 2.2 Explicit Initialization
You can also manually assign values. If you initialize one member, the following members will auto-increment from that value.

```typescript
enum StatusCode {
  Success = 200,
  BadRequest = 400,
  Unauthorized, // 401 (auto-incremented)
  NotFound = 404,
  MethodNotAllowed // 405 (auto-incremented from 404)
}

console.log(StatusCode.Unauthorized); // Output: 401
```

### 2.3 Reverse Mapping
One unique feature of numeric enums is **Reverse Mapping**. This allows you to get the name of an enum member if you have its value.

```typescript
enum Color {
  Red = 1,
  Green,
  Blue
}

let c: Color = Color.Green;
console.log(c);            // Output: 2
console.log(Color[c]);     // Output: "Green" (Reverse Mapping)
```

> [!IMPORTANT]
> **Reverse mapping only works for numeric enums.** String enums do not support this feature because there is no logical way to map a string back to a unique name without ambiguity.

[↑ Back to Table of Contents](#table-of-contents)

***

*While numeric enums are powerful for internal logic, they can be opaque in debugging. Let's explore String Enums for better clarity.*

## 3. String Enums

**String Enums** allow you to assign a string literal to each member. Unlike numeric enums, string enums are much more readable when debugging or looking at logs/network payloads.

### 3.1 Implementation
In a string enum, every member must be explicitly initialized with a string value.

```typescript
enum OrderStatus {
  Pending = "PENDING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

console.log(OrderStatus.Shipped); // Output: "SHIPPED"
```

### 3.2 Advantages of String Enums
* **Readability:** When you log an `OrderStatus.Shipped`, you see `"SHIPPED"` instead of an arbitrary number like `1`.
* **Predictability:** The value is explicit and doesn't change if you reorder the enum members.
* **Debugging:** Values are human-readable in API responses and database entries.

[↑ Back to Table of Contents](#table-of-contents)

***

*To wrap up, let's compare the two approaches to help you decide which to use in your projects.*

## 4. Comparison: Numeric vs. String Enums

Choosing between numeric and string enums depends on your specific use case (e.g., performance vs. debuggability).

| Feature | Numeric Enums | String Enums |
| :--- | :--- | :--- |
| **Default Values** | Yes (starts at `0`) | No (must be explicit) |
| **Auto-Incrementing** | Yes | No |
| **Reverse Mapping** | ✅ Supported | ❌ Not Supported |
| **Debugging Clarity** | ⚠️ Low (shows numbers) | ✅ High (shows strings) |
| **Payload Size** | 🚀 Smaller (integers) | 📦 Larger (strings) |
| **Best Use Case** | Internal state, bitwise flags, high-performance logic. | API communication, configuration, UI labels, anything involving logs. |

> [!TIP]
> **The Golden Rule:** If the value needs to be sent over a network (API) or stored in a database where humans might read it, **prefer String Enums**. If you are optimizing for performance or using the enum for internal mathematical logic, **use Numeric Enums**.

[↑ Back to Table of Contents](#table-of-contents)
