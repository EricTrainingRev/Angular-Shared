import { Component, computed, signal, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

// One of the widget classes the page can render, paired with a label for the UI.
// Declared at module scope because TypeScript does not allow type aliases inside
// a class body; Type<unknown> is the type Angular's ngComponentOutlet accepts.
type WidgetOption = {
  component: Type<unknown>;
  label: string;
};

/**
 * AnnouncementWidget: one of the two "dynamic" widgets rendered through
 * ngComponentOutlet. It is a plain, self-contained component; the host page
 * does not know it in its template — it only knows the component class it is
 * told to render. Inline template + styles keep this small widget co-located.
 */
@Component({
  selector: 'app-announcement-widget',
  template: `
    <div class="widget announcement">
      <h4>Announcement</h4>
      <p>Version 2.0 is here. Swap between widget <em>component classes</em> with the buttons below.</p>
    </div>
  `,
  styles: `
    .widget { border: 1px solid #ccc; border-radius: 4px; padding: 0.75rem 1rem; background: #fff; }
    .widget h4 { margin: 0 0 0.35rem; }
    .widget p { margin: 0; }
  `,
})
export class AnnouncementWidget {}

/**
 * StatusWidget: the second "dynamic" widget. Rendered in exactly the same spot
 * as AnnouncementWidget once the page swaps the active component class — that is
 * what [ngComponentOutlet] does: render whatever component class it is given.
 */
@Component({
  selector: 'app-status-widget',
  template: `
    <div class="widget status-widget">
      <h4>Server status</h4>
      <p><span class="status-dot"></span> All systems operational.</p>
    </div>
  `,
  styles: `
    .widget { border: 1px solid #ccc; border-radius: 4px; padding: 0.75rem 1rem; background: #fff; }
    .widget h4 { margin: 0 0 0.35rem; }
    .widget p { margin: 0; }
    .status-dot { display: inline-block; width: 0.7rem; height: 0.7rem; border-radius: 50%; background: green; margin-right: 0.4rem; }
  `,
})
export class StatusWidget {}

/**
 * The dynamic-components showcase. Instead of hard-coding one child in its
 * template, it renders whichever component class is currently selected via
 * [ngComponentOutlet] — the declarative way to load components at runtime.
 */
@Component({
  selector: 'app-dynamic-widget',
  imports: [NgComponentOutlet],
  templateUrl: './dynamic-widget.html',
  styleUrl: './dynamic-widget.css',
})
export class DynamicWidget {
  // --- Which widget is currently shown ---
  // A plain boolean signal drives the choice. The template never names either
  // widget directly: it renders whatever selectedWidget() resolves to.
  protected readonly showAnnouncementWidget = signal(true);

  // computed() derives the active widget (class + label) from state. When the
  // boolean flips, this recomputes and ngComponentOutlet swaps the rendered
  // component to the new class.
  protected readonly selectedWidget = computed<WidgetOption>(() =>
    this.showAnnouncementWidget()
      ? { component: AnnouncementWidget, label: 'Announcement' }
      : { component: StatusWidget, label: 'Server status' },
  );

  // --- Switching widgets ---
  protected selectAnnouncement(): void {
    this.showAnnouncementWidget.set(true);
  }

  protected selectStatus(): void {
    this.showAnnouncementWidget.set(false);
  }
}
