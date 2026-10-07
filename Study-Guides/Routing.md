# Angular Navigation: Routing & Route Guards

## Table of Contents

* [1. High-Level Overview](#1-high-level-overview)
* [2. Angular Routing Fundamentals](#2-angular-routing-fundamentals)
    * [2.1 The Router Module](#21-the-router-module)
    * [2.2 Defining Routes](#22-defining-routes)
    * [2.3 Displaying Components: RouterOutlet](#23-displaying-components-routeroutlet)
    * [2.4 Navigation: RouterLink vs. Programmatic](#24-navigation-routerlink-vs-programmatic)
* [3. Route Guards: Securing Navigation](#3-route-guards-securing-navigation)
    * [3.1 Purpose of Guards](#31-purpose-of-guards)
    * [3.2 Common Guard Types](#32-common-guard-types)
    * [3.3 Guard Comparison Table](#33-guard-comparison-table)
* [4. Summary & Best Practices](#4-summary--best-practices)

***

## 1. High-Level Overview

In a **Single-Page Application (SPA)** like **Angular**, the page does not reload when a user interacts with the application. Instead, the **Angular Router** intercepts **URL changes** and dynamically swaps **components** in and out of the view. This creates the illusion of navigating between different pages while maintaining a seamless, fast user experience.

This module covers the core mechanics of the **Angular Router** and the security layer provided by **Route Guards**, which allow you to control access to specific parts of your application based on user state or logic.

[↑ Back to Table of Contents](#table-of-contents)

***

*Now that we understand the concept of SPA navigation, let's look at the underlying structural framework: the Router itself.*

## 2. Angular Routing Fundamentals

**Routing** is the mechanism that maps a specific **URL path** to a specific **Angular component**.

### 2.1 The Router Module

To enable routing, your application must import the **`RouterModule`**. In modern **Angular (v15+)**, this is often configured in the **`app.config.ts`** using the **`provideRouter`** function.

**Traditional Approach (NgModule):**
```typescript
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Route definitions go here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

**Modern Approach (Standalone):**
```typescript
// app.config.ts
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
```

### 2.2 Defining Routes

A **Route** is an object that tells Angular: "If the URL looks like *this*, show *this* component."

```typescript
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'profile/:id', component: ProfileComponent }, // Path with parameter
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: '**', component: PageNotFoundComponent }     // Wildcard/404 route
];
```

> [!IMPORTANT]
> **The Order of Routes Matters:** The Router uses a **"first-match" strategy**. Always place your specific routes (e.g., `profile/:id`) *before* your **wildcard route** (`**`), or the wildcard will intercept everything.

### 2.3 Displaying Components: RouterOutlet

The **`<router-outlet>`** directive is a placeholder. It tells Angular exactly where in your **HTML template** the routed component should be injected.

```html
<!-- app.component.html -->
<nav>
  <!-- Navigation links -->
</nav>

<main>
  <!-- The matched component will appear here -->
  <router-outlet></router-outlet>
</main>
```

### 2.4 Navigation: RouterLink vs. Programmatic

There are two primary ways to move a user from one view to another.

| Method | Syntax/Usage | Best For... |
| :--- | :--- | :--- |
| **`RouterLink`** | `<a [routerLink]="['/profile', userId]">Profile</a>` | **Declarative navigation** via HTML templates (User clicks). |
| **Programmatic** | `this.router.navigate(['/home']);` | Navigation triggered by **logic** (e.g., after a successful login). |

**Programmatic Example:**
```typescript
import { Router } from '@angular/router';

@Component({...})
export class LoginComponent {
  constructor(private router: Router) {}

  onLogin() {
    // ... logic to authenticate user
    this.router.navigate(['/dashboard']);
  }
}
```

[↑ Back to Table of Contents](#table-of-contents)

***

*While the Router handles "where" to go, we often need to decide "if" a user is allowed to go there. This is where Route Guards come in.*

## 3. Route Guards: Securing Navigation

**Route Guards** are interfaces that allow you to check conditions before a **navigation event** is completed. If a guard returns `false` or an empty **`UrlTree`**, the navigation is cancelled or redirected.

### 3.1 Purpose of Guards

Guards are essential for:
* **Authentication:** Preventing unauthenticated users from reaching private pages.
* **Authorization:** Restricting access based on **user roles** (e.g., `Admin` vs `User`).
* **Data Integrity:** Preventing users from accidentally navigating away from a half-filled form.
* **Data Pre-fetching:** Ensuring necessary data is loaded before the component renders.

### 3.2 Common Guard Types

In modern Angular, guards are typically implemented as **Functional Guards**.

1.  **`CanActivate`**: Decides if a route can be activated.
2.  **`CanActivateChild`**: Decides if the children of a route can be activated.
3.  **`CanDeactivate`**: Decides if the user can leave a route (useful for unsaved changes).
4.  **`CanMatch`**: Decides if a route can be matched at all (often used for **lazy-loaded modules**).
5.  **`Resolve`**: A **"pre-fetcher"** that fetches data *before* the route is activated.

### 3.3 Guard Comparison Table

| Guard Type | Goal | Typical Logic |
| :--- | :--- | :--- |
| **`CanActivate`** | Entry Control | `isLoggedIn ? true : redirectToLogin` |
| **`CanDeactivate`** | Exit Control | `hasUnsavedChanges ? confirm() : true` |
| **`CanMatch`** | Loading Control | `hasPermissionForModule ? true : false` |
| **`Resolve`** | Data Readiness | `fetchUserData(id)` |

**Example: Functional `CanActivate` Guard**

```typescript
// auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Redirect to login if not authenticated
    return router.parseUrl('/login');
  }
};
```

**Applying the Guard in Routes:**

```typescript
const routes: Routes = [
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [authGuard] // The guard is applied here
  }
];
```

[↑ Back to Table of Contents](#table-of-contents)

***

## 4. Summary & Best Practices

* **Use `RouterLink` for UX:** Prefer declarative **`[routerLink]`** in templates for standard user navigation.
* **Order Matters:** Always place your **Wildcard (`**`)** route last.
* **Favor Functional Guards:** Use the modern **functional approach** for guards rather than class-based ones.
* **Data Integrity:** Use **`CanDeactivate`** to protect users from losing work in forms.
* **Security Note:** Remember that **Client-Side Guards** are for **User Experience**. They prevent users from seeing pages they shouldn't, but they are *not* a substitute for **Server-Side Security**. An attacker can always bypass client-side logic; always protect your **API endpoints**!

> [!TIP]
> When using **`CanDeactivate`** to prevent data loss, always pair it with an **`Observable`** or **`Promise`** so the user can confirm their intention via a dialog box.
