import { Component, EventEmitter, Input, Output, input, output } from '@angular/core';

/**
 * A reusable child component that demonstrates the two ways a child can
 * communicate with its parent:
 *
 *  - Data flows DOWN from the parent into the child via inputs.
 *  - Events flow UP from the child to the parent via outputs.
 *
 * It exposes BOTH the traditional decorator API (@Input / @Output) and the
 * modern signal API (input() / output()) so the two can be compared side by
 * side. The parent template binds to them with the same syntax either way.
 */
@Component({
  selector: 'app-message-board',
  imports: [],
  templateUrl: './message-board.html',
  styleUrl: './message-board.css',
})
export class MessageBoard {
  // --- Decorator-based inputs and outputs (traditional) ---
  // @Input marks a property as an entry point for data coming from the parent.
  // The parent binds to it with [title]="...".
  @Input() title = 'Message board';

  // @Output marks a property as an event the child can raise for the parent.
  // The parent listens with (titleChanged)="...". EventEmitter is the object
  // that carries the value up; .emit() fires the event.
  @Output() titleChanged = new EventEmitter<string>();

  // --- Signal-based inputs and outputs (modern) ---
  // input() is the signal equivalent of @Input. It is read-only from the
  // child's perspective: the child calls message() to read the value, but only
  // the parent can set it. The parent binds with the same [message]="..." syntax.
  readonly message = input('Hello from the child!');

  // output() is the signal equivalent of @Output. The child calls .emit() to
  // send a value up; the parent listens with (messageSent)="...".
  readonly messageSent = output<string>();

  // --- Child-to-parent events ---
  // Called from the template when the user clicks "Send message up".
  // Emits the current message value so the parent can react to it.
  protected sendMessageUp(): void {
    this.messageSent.emit(this.message());
  }

  // Called from the template when the user clicks "Rename board".
  // Emits a new title so the parent can update the value it passes back down.
  protected renameBoard(): void {
    this.titleChanged.emit('Board renamed by the child');
  }
}
