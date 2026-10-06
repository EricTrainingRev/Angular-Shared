import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DynamicWidget } from '../dynamic-widget/dynamic-widget';
import { Emulated } from '../emulated/emulated';
import { Lifecycle } from '../lifecycle/lifecycle';
import { NoScope } from '../no-scope/no-scope';

/**
 * The components page. It imports and renders four child components — a
 * lifecycle logger, a dynamic widget loaded via [ngComponentOutlet], and an
 * emulated/no-scope style pair — then demonstrates change detection with OnPush
 * driven by signals and computed(), and closes with a narrative on NgModule vs
 * standalone components.
 */
@Component({
  selector: 'app-components',
  imports: [Lifecycle, DynamicWidget, Emulated, NoScope],
  templateUrl: './components.html',
  styleUrl: './components.css',
  // OnPush: this page only re-renders when a signal it reads changes (or an
  // event/input triggers a check). Combined with signals, updates are
  // fine-grained — only the component whose signal changed is re-rendered.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Components {
  // --- Parent → child input (drives the lifecycle child's ngOnChanges) ---
  // The name bound into <app-lifecycle>'s subjectName input. Changing it fires
  // ngOnChanges on the child, which the child logs on screen — demonstrating
  // parent-to-child data flow through an input().
  protected readonly subjectNameValue = signal('Ada Lovelace');

  protected updateSubjectName(newName: string): void {
    this.subjectNameValue.set(newName);
  }

  // --- Change detection (OnPush) demo ---
  // The counter shown in the OnPush section. Holding it in a signal means only
  // the components/expressions that read it re-render when it changes.
  protected readonly counterValue = signal(0);

  // computed() derives a value from the counter without storing a second copy.
  // Because it reads a signal, it recomputes — and the template re-renders —
  // automatically whenever the counter changes.
  protected readonly doubledCount = computed(() => this.counterValue() * 2);

  // A second derived signal: whether the counter is even or odd.
  protected readonly counterParity = computed(() =>
    this.counterValue() % 2 === 0 ? 'even' : 'odd',
  );

  protected increment(): void {
    this.counterValue.update((c) => c + 1);
  }

  protected decrement(): void {
    this.counterValue.update((c) => c - 1);
  }
}
