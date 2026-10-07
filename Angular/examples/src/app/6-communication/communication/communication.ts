import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageBoard } from '../../message-board/message-board';

/**
 * A showcase of how components share data. The core rule of Angular
 * communication is: data flows DOWN (parent -> child) and events flow UP
 * (child -> parent). This page demonstrates both directions with the
 * MessageBoard child, using the traditional decorator API (@Input/@Output)
 * and the modern signal API (input()/output()) side by side.
 */
@Component({
  selector: 'app-communication',
  imports: [MessageBoard, FormsModule],
  templateUrl: './communication.html',
  styleUrl: './communication.css',
})
export class Communication {
  // --- Parent -> child: inputs ---
  // The message the parent sends DOWN to the child via [message]. The user
  // types it in the input below; the child renders it. Demonstrates property
  // binding ([message]) and the signal input() API.
  protected readonly parentMessage = signal('Hello from the parent!');

  // The board title the parent sends DOWN to the child via [title]. It is
  // also updated by the child's "Rename board" event, so it demonstrates the
  // full round trip: child emits up, parent updates, value flows back down.
  protected readonly boardTitle = signal('My message board');

  // --- Child -> parent: outputs ---
  // The value the child sent UP via (messageSent). The parent stores it here
  // and displays it, proving the event carried data from child to parent.
  protected readonly receivedFromChild = signal('Nothing received yet.');

  protected onMessageSent(message: string): void {
    this.receivedFromChild.set(message);
  }

  // Called when the child emits (titleChanged). Updates the title signal,
  // which flows back DOWN to the child via [title] — a complete round trip.
  protected onTitleChanged(newTitle: string): void {
    this.boardTitle.set(newTitle);
  }

  // --- Two-way binding (ngModel) ---
  // The nickname bound with [(ngModel)] (the "banana in a box" syntax). It is
  // a signal, so typing in the input updates it and the display stays in sync.
  protected readonly nickname = signal('Explorer');
}
