import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TaskStoreService } from '../../services/task-store.service';

/**
 * A child that DECLARES TaskStoreService in its own providers array. That tells
 * Angular: when code inside this subtree asks for TaskStoreService, build a
 * BRAND-NEW instance right here instead of using the root singleton. So this child
 * gets a private, empty store that starts completely separate from the shared
 * list shown elsewhere on the page.
 *
 * Consequences this showcases (component-scoped service lifecycle):
 *  - Isolated state — starts empty, never touches the singleton's data.
 *  - One instance per component — render this twice and each gets its own store.
 *  - Lifecycle-bound — born with the component, destroyed with it.
 */
@Component({
  selector: 'app-scoped-child',
  imports: [],
  templateUrl: './scoped-child.html',
  styleUrl: './scoped-child.css',
  // Component-scoped provider: the nearest provider for TaskStoreService is
  // this component, so inject() below resolves to a fresh, private instance.
  providers: [TaskStoreService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScopedChild {
  // inject() resolves to the NEAREST provider, which is the one declared on
  // this very component — a new empty store that shares nothing with the root.
  private readonly store = inject(TaskStoreService);

  // Read-throughs for the template: these signals belong to this component's
  // OWN store, isolated from the singleton list on the rest of the page.
  protected readonly tasks = this.store.tasks;
  protected readonly openTaskCount = this.store.openTaskCount;

  // The draft title being typed in this child's own form. It is component-local
  // UI state (not shared data), so it lives in a local signal here — the same
  // component-vs-root distinction the notes make, applied to a real signal.
  protected readonly newTaskTitle = signal('');

  protected updateNewTaskTitle(value: string): void {
    this.newTaskTitle.set(value);
  }

  // Add/toggle forward to THIS store's methods — the private instance, so a
  // task added here never appears in the shared list.
  protected addTask(): void {
    this.store.addTask(this.newTaskTitle());
    this.newTaskTitle.set('');
  }

  protected toggleTask(id: number): void {
    this.store.toggleTask(id);
  }
}
