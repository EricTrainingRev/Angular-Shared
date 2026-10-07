import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, ReplaySubject, Subject, catchError, of } from 'rxjs';

import { DataService, Post } from '../services/data.service';

/** The lifecycle of the HTTP request, driving the loading / error / data states. */
type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * The Async & HTTP page. It teaches three RxJS/async topics by doing them:
 * Observables (subscribe + AsyncPipe + the unsubscription story), Subjects
 * (Subject vs BehaviorSubject vs ReplaySubject), and HttpClient (a live GET
 * with loading/error states). Each topic is a self-contained section below.
 *
 * Signals drive the component's own state (OnPush), while RxJS streams feed
 * in — the Subject section shows the bridge between the two paradigms.
 */
@Component({
  selector: 'app-async-http',
  imports: [AsyncPipe],
  templateUrl: './async-http.html',
  styleUrl: './async-http.css',
  // OnPush: this page re-renders only when the signals it reads change. RxJS
  // values are pushed into signals, so updates stay fine-grained.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncHTTP {
  // --- Section A: Observables ---
  // The DataService returns an Observable<Post[]>. It is LAZY — nothing
  // happens until something subscribes. We subscribe twice below to show the
  // two idiomatic ways to consume it.
  private readonly dataService = inject(DataService);
  protected readonly posts$ = this.dataService.fetchPosts();

  // A signal is a reactive container: reading it with () in the template
  // re-renders whenever its value changes. Here it holds the posts that a
  // MANUAL subscribe writes into, to contrast with the AsyncPipe below.
  protected readonly manualPosts = signal<Post[]>([]);

  // takeUntilDestroyed() is the modern way to clean up a manual subscription:
  // it unsubscribes automatically when this component is destroyed. It needs
  // the injected DestroyRef to know when that happens. (The older alternatives
  // are a manual .unsubscribe() call or the takeUntil operator with a Subject
  // that fires in ngOnDestroy — takeUntilDestroyed replaces that boilerplate.)
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.posts$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((posts) => this.manualPosts.set(posts));
  }

  // --- Section B: Subjects ---
  // A Subject is both a source and a sink: you push values into it with
  // .next(), and every subscriber receives them. The three flavors differ in
  // what a NEW subscriber gets on joining:
  //   Subject          — nothing from before it subscribed.
  //   BehaviorSubject  — the single most recent value.
  //   ReplaySubject(3) — the last 3 values, replayed in order.
  protected readonly plainSubject = new Subject<string>();
  protected readonly behaviorSubject = new BehaviorSubject<string>('initial');
  protected readonly replaySubject = new ReplaySubject<string>(3);

  // Each subscriber's received values, rendered into the on-page log panel.
  // The "late subscriber" button joins a new subscriber after a short delay so
  // the buffering contrast (nothing / latest / last-3) becomes visible.
  protected readonly plainLog = signal<string[]>([]);
  protected readonly behaviorLog = signal<string[]>([]);
  protected readonly replayLog = signal<string[]>([]);

  protected readonly subjectInput = signal('');

  protected updateSubjectInput(value: string): void {
    this.subjectInput.set(value);
  }

  protected emitToSubjects(): void {
    const value = this.subjectInput();
    this.plainSubject.next(value);
    this.behaviorSubject.next(value);
    this.replaySubject.next(value);
  }

  protected subscribeLate(): void {
    // A short delay simulates a subscriber joining after values were already
    // emitted, which is what makes the three buffering behaviors observable.
    setTimeout(() => {
      this.plainSubject.subscribe((v) => this.plainLog.update((log) => [...log, v]));
      this.behaviorSubject.subscribe((v) => this.behaviorLog.update((log) => [...log, v]));
      this.replaySubject.subscribe((v) => this.replayLog.update((log) => [...log, v]));
    }, 1500);
  }

  // --- Section C: HttpClient ---
  // fetchStatus drives the loading / error / data states shown with @switch.
  // It is not displayed itself, but it still controls what the template
  // renders, so a signal is the right choice.
  protected readonly fetchStatus = signal<FetchStatus>('idle');
  protected readonly posts = signal<Post[]>([]);
  protected readonly errorMessage = signal('');

  protected loadPosts(): void {
    this.fetchStatus.set('loading');
    this.errorMessage.set('');
    this.dataService
      .fetchPosts()
      .pipe(
        // catchError intercepts a failed request and returns a fallback stream
        // instead of letting the error propagate. Here it records the error
        // state and returns an empty array so the subscription still completes
        // normally — the @switch in the template then shows the error message.
        catchError(() => {
          this.errorMessage.set('Could not load posts. Check your connection and try again.');
          this.fetchStatus.set('error');
          return of([]);
        }),
      )
      .subscribe((posts) => {
        this.posts.set(posts);
        this.fetchStatus.set('success');
      });
  }
}
