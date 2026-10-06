import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';

// One line in the on-screen lifecycle log: which hook fired, and a plain-language
// reason it runs. Declared at module scope because TypeScript does not allow type
// aliases inside a class body.
type LifecycleLogEntry = {
  hook: string;
  why: string;
};

/**
 * A child component that renders its own Angular lifecycle as a visible, ordered
 * log. Each lifecycle hook appends a line when it fires, so you can watch a
 * component move through its life. It shows all eight hooks: ngOnChanges,
 * ngOnInit, ngDoCheck, ngAfterContentInit, ngAfterContentChecked,
 * ngAfterViewInit, ngAfterViewChecked, ngOnDestroy.
 *
 * The parent can change the `subjectName` input, which fires ngOnChanges and
 * demonstrates "react to an input update" — the hook meant for that job.
 */
@Component({
  selector: 'app-lifecycle',
  imports: [],
  templateUrl: './lifecycle.html',
  styleUrl: './lifecycle.css',
})
export class Lifecycle
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  // Keeps the log from growing forever: the "checked" hooks (and ngDoCheck) fire
  // on EVERY change-detection pass, so over time they would flood the page.
  private static readonly LOG_LIMIT = 12;

  // --- The input the parent can change ---
  // An input(). The parent binds this value; when it changes, Angular fires
  // ngOnChanges on this component. This demonstrates the hook that reacts to
  // data updates from a parent.
  public readonly subjectName = input('Ada Lovelace');

  // --- The on-screen log ---
  // The entries rendered by the @for block in the template. Each lifecycle hook
  // appends to this list when it fires.
  protected readonly log = signal<LifecycleLogEntry[]>([]);

  // --- Lifecycle hooks (each logs itself as it fires) ---

  // Fires when an @Input() property's value changes. Use it to react to data
  // updates coming in from a parent.
  ngOnChanges(): void {
    this.record('ngOnChanges', 'Fires when an input() value changes — react to a parent update.');
  }

  // Fires once, right after the first ngOnChanges. The usual place to set up
  // data, call a service, or subscribe.
  ngOnInit(): void {
    this.record('ngOnInit', 'Fires once after the first ngOnChanges — initialize data.');
  }

  // Fires during every change detection cycle. Use it sparingly: it runs
  // constantly, so heavy logic here hurts performance.
  ngDoCheck(): void {
    this.record('ngDoCheck', 'Fires on every change-detection pass — use sparingly.');
  }

  // Fires after projected content (<ng-content>) is initialized.
  ngAfterContentInit(): void {
    this.record('ngAfterContentInit', 'Fires after projected content is initialized.');
  }

  // Fires after every check of the projected content.
  ngAfterContentChecked(): void {
    this.record('ngAfterContentChecked', 'Fires after every check of projected content.');
  }

  // Fires after the component's view (and its children) is initialized. A common
  // spot for DOM work after the view is ready.
  ngAfterViewInit(): void {
    this.record('ngAfterViewInit', 'Fires after the view is initialized — safe to touch the DOM.');
  }

  // Fires after every check of the component's view.
  ngAfterViewChecked(): void {
    this.record('ngAfterViewChecked', 'Fires after every check of the view.');
  }

  // Fires just before the component is destroyed. Clean up subscriptions, timers,
  // and listeners here.
  ngOnDestroy(): void {
    this.record('ngOnDestroy', 'Fires just before destruction — clean up subscriptions/timers.');
  }

  // --- Helpers ---

  // Appends a log entry, trimming to the limit. The update is scheduled on the
  // next event-loop turn (setTimeout) so the signal isn't written while Angular
  // is mid change-detection — writing a signal inside a lifecycle hook would
  // otherwise risk an ExpressionChangedAfterItHasBeenChecked error in development.
  private record(hook: string, why: string): void {
    setTimeout(() => {
      this.log.update((entries) => [...entries, { hook, why }].slice(-Lifecycle.LOG_LIMIT));
    });
  }

  // Clears the on-screen log so you can restart and watch it fill again.
  protected clearLog(): void {
    this.log.set([]);
  }
}
