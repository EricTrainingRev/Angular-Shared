import { Injectable, computed, signal } from '@angular/core';

/**
 * The shape of one item in the shared to-do list. Exported so the components
 * that render the list can type the data without reaching inside the store.
 */
export interface Task {
  /** A stable, unique id used to target a specific item for toggle/remove. */
  id: number;
  /** The user-facing text describing what the task is. */
  title: string;
  /** Whether the item has been checked off as finished. */
  done: boolean;
}

/**
 * TaskStoreService owns this example's shared state — the to-do list.
 *
 * Two parts are worth reading carefully:
 *
 * 1. The @Injectable decorator marks this class as something the Dependency
 *    Injection (DI) system can hand out. The `providedIn: 'root'` part tells
 *    Angular to register it in the ROOT injector, which means there is exactly
 *    ONE instance for the whole app (a singleton). Every component that asks
 *    for this service is handed the same object — that is why state stored here
 *    is shared everywhere.
 *
 * 2. Notice the components that use this never write `new TaskStoreService()`.
 *    They ask for it and the injector supplies it. That is Dependency
 *    Injection: a class receives its dependency instead of constructing it
 *    itself, which keeps components decoupled (and lets a test swap in a fake
 *    store without touching the component's code).
 */
@Injectable({ providedIn: 'root' })
export class TaskStoreService {
  // The writable signal is PRIVATE — no component can reach it, so none of them
  // can call .set()/.update() on the list. Consumers only ever see `tasks`
  // (below), a read-only projection that preserves reactivity but strips the
  // write methods. That makes addTask()/toggleTask()/removeTask() genuinely
  // the only ways to change the data, enforced by the type system rather than
  // by convention.
  private readonly tasksSignal = signal<Task[]>([]);

  /** The single source of truth for the list. A read-only signal (asReadonly)
   *  that components read in the template; they cannot mutate it directly. */
  readonly tasks = this.tasksSignal.asReadonly();

  /** Derived value: how many items are still open. computed() watches tasks()
   *  and recomputes whenever it changes, so this stays correct with no second
   *  copy of the data to keep in sync. */
  readonly openTaskCount = computed(
    () => this.tasksSignal().filter((task) => !task.done).length,
  );

  /** The next id to hand out. Kept private to guarantee unique ids. */
  private nextId = 1;

  /** Seed a few example tasks so the page has something to render on load. */
  constructor() {
    this.addTask('Learn what a service is');
    this.addTask('Inject the service with inject()');
    this.addTask('See the shared singleton vs a scoped copy');
  }

  /** The way to add a task. Encapsulating mutations in methods means the
   *  store stays the single owner of its data — components never reach in and
   *  set the signal directly. */
  addTask(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    this.tasksSignal.update((list) => [
      ...list,
      { id: this.nextId++, title: trimmed, done: false },
    ]);
  }

  /** Flip whether an item is done, matching by id so the target is stable. */
  toggleTask(id: number): void {
    this.tasksSignal.update((list) =>
      list.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  /** Remove an item by id. */
  removeTask(id: number): void {
    this.tasksSignal.update((list) => list.filter((task) => task.id !== id));
  }
}
