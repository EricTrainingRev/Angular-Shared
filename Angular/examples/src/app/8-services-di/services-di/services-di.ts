import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SingletonChild } from '../provider-children/singleton-child/singleton-child';
import { ScopedChild } from '../provider-children/scoped-child/scoped-child';
import { TaskStoreService } from '../services/task-store.service';

/**
 * The Services & Dependency Injection page. It injects the shared TaskStoreService
 * and renders the task form/list plus BOTH provider children — one reading the
 * root singleton, one with its own component-scoped instance. Together they make
 * the DI mechanics (injector, providers, singleton vs component-scoped lifecycle)
 * visible in real shared state rather than in prose.
 */
@Component({
  selector: 'app-services-di',
  imports: [SingletonChild, ScopedChild],
  templateUrl: './services-di.html',
  styleUrl: './services-di.css',
  // OnPush: this page re-renders only when the store signals it reads change
  // (or an event/input triggers a check). Since all shared state lives in the
  // store's signals, updates stay fine-grained.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesDI {
  // --- Dependency Injection ---
  // inject() is the modern way to receive a dependency: it asks the DI system
  // for TaskStoreService and is handed the root singleton (created by the
  // @Injectable({ providedIn: 'root' }) on the service class). The OLDER form
  // is a constructor parameter — `constructor(private store: TaskStoreService)`
  // — which receives the same object. inject() is the preferred standalone form.
  private readonly store = inject(TaskStoreService);

  // --- Read-through, not copies ---
  // These are the SAME signal objects from the store, forwarded for the
  // template to read. The page holds no second copy of the state — it just
  // points at the store's signals, so every panel stays in sync with the
  // single source of truth.
  protected readonly tasks = this.store.tasks;
  protected readonly openTaskCount = this.store.openTaskCount;

  // --- Component-local UI state ---
  // The draft title being typed in the form is COMPONENT-local, not in the
  // store. This is the component-vs-root distinction: draft text belongs to
  // this view alone and would clutter a shared service, so it lives in a local
  // signal here. Only data that must be shared belongs in the store.
  protected readonly newTaskTitle = signal('');

  protected updateNewTaskTitle(value: string): void {
    this.newTaskTitle.set(value);
  }

  // --- Action wrappers ---
  // Each user gesture is forwarded to a store method. The component never
  // mutates the store's signals directly; the store remains its own owner.
  protected addTask(): void {
    this.store.addTask(this.newTaskTitle());
    this.newTaskTitle.set('');
  }

  protected toggleTask(id: number): void {
    this.store.toggleTask(id);
  }

  protected removeTask(id: number): void {
    this.store.removeTask(id);
  }
}
