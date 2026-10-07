import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskStoreService } from '../../services/task-store.service';

/**
 * A child that deliberately declares NO providers array. Leaving the provider
 * out is the whole point: when this component asks for TaskStoreService, DI
 * walks UP the injector tree until it finds the nearest provider — which, for
 * this service, is the ROOT. So this child receives the app-wide SINGLETON,
 * the very same object the container uses. Whatever it changes is visible
 * everywhere else that reads the same store.
 */
@Component({
  selector: 'app-singleton-child',
  imports: [],
  templateUrl: './singleton-child.html',
  styleUrl: './singleton-child.css',
  // OnPush: this view re-renders only when the signals it reads change, which
  // is exactly the right behaviour for a view that just reflects shared state.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingletonChild {
  // inject() asks the DI system for TaskStoreService. Because this component
  // provides nothing locally, the injector resolves it from the root — the
  // same singleton the container holds. One shared object, not a copy.
  private readonly store = inject(TaskStoreService);

  // Read-through for the template: these are the SAME signal objects from the
  // shared store, so the list and the badge always reflect the single source
  // of truth.
  protected readonly tasks = this.store.tasks;
  protected readonly openTaskCount = this.store.openTaskCount;

  // This child can mutate the shared store too. Toggling a check here updates
  // the container's open-task badge in the same moment — visible proof that
  // both views read (and write) one root object.
  protected toggleTask(id: number): void {
    this.store.toggleTask(id);
  }
}
