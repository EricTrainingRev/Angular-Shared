import { Component, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, LowerCasePipe, UpperCasePipe } from '@angular/common';

import { JoinImpurePipe } from '../pipe-example/join-impure-pipe';
import { JoinPipe } from '../pipe-example/join-pipe';
import { SquarePipe } from '../pipe-example/square-pipe';

/**
 * A showcase of Angular pipes. Each section of the template demonstrates one
 * concept (built-in pipes, a custom pipe, pure vs impure behavior), and the
 * state below is grouped to match those sections.
 */
@Component({
  selector: 'app-pipe',
  imports: [CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, LowerCasePipe, UpperCasePipe, JoinImpurePipe, JoinPipe, SquarePipe],
  templateUrl: './pipe.html',
  styleUrl: './pipe.css',
})
export class Pipe {
  // --- Built-in pipes ---
  // The date rendered by the date pipe. A signal so the displayed value
  // updates when it changes.
  protected readonly today = signal(new Date(2023, 0, 1));

  // The number formatted by the currency and number pipes.
  protected readonly price = signal(1234.5);

  // The object rendered by the json pipe.
  protected readonly user = signal({ id: 1, name: 'Hermes', role: 'admin' });

  // --- Custom pipe: square ---
  // The number squared by the custom square pipe.
  protected readonly baseNumber = signal(5);

  // --- Pure vs impure pipes ---
  // The list rendered by the pure and impure pipes. The pure pipe only
  // re-runs when the array reference changes; the impure pipe re-runs on
  // every change-detection cycle, so it picks up in-place mutations.
  protected readonly items = signal([1, 2, 3]);

  // Adds a new item to the list. It mutates the array IN PLACE and returns the
  // same reference, so the pure pipe below misses the change (its input
  // reference didn't change) while the impure pipe catches it. This is the
  // exact scenario that makes an impure pipe necessary.
  protected addItem(): void {
    this.items.update((list) => {
      list.push(list.length + 1);
      return list;
    });
  }
}
