/**
 * rxjs-stuff.ts — a self-contained, runnable walkthrough of Observables and
 * Subjects.
 *
 * It's written as a plain console script (no Angular dependency) so you can
 * focus on the RxJS mechanics in isolation
 */

import {
  AsyncSubject,
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  filter,
  interval,
  map,
  of,
  take,
  takeUntil,
} from 'rxjs';

// ===========================================================================
// PART 1 — CREATING OBSERVABLES
// ===========================================================================
// An Observable is LAZY: nothing executes until something subscribes. This is
// the single most important rule from the notes (§3.2). The line below only
// BUILDS the stream; not one value is emitted until a subscriber appears.
console.log('=== PART 1: Creating Observables ===');

// `of(...)` — emit a fixed sequence of values, then complete.
const numbers$: Observable<number> = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// `interval(ms)` — emit 0, 1, 2, ... every `ms` milliseconds. It never
// completes on its own, which is exactly why unsubscription matters (§3.3).
const ticks$ = interval(1000);

// `new Observable(...)` — the raw constructor: a function that receives an
// Observer and pushes values to it. This is the foundational "push-based"
// pattern: a Producer pushing to a Consumer.
const custom$ = new Observable<number>((observer) => {
  observer.next(100);
  observer.next(200);
  observer.complete(); // signals "done"; further .next() calls are ignored
});
// NOTE: the producer function above does NOT run yet — it runs only on
// subscription. Lazy execution in action.

// ===========================================================================
// PART 2 — OPERATING ON OBSERVABLES PIPE() & OPERATORS
// ===========================================================================
// .pipe() chains pure transformations. Operators like `filter` and `map`
// receive values from the source, transform them, and hand the result to the
// next operator / subscriber. They never mutate the source stream.
console.log('\n=== PART 2: Operators via .pipe() ===');

// Grab just the even numbers, double them, and stop after 3 results.
// `take(3)` closes the stream so we don't keep counting forever.
const evens$ = numbers$.pipe(
  filter((n) => n % 2 === 0), // keep only even numbers
  map((n) => n * 2),          // then double each survivor
  take(3),                    // and stop after three emissions
);

evens$.subscribe({
  next: (value) => console.log('even → ', value),
  complete: () => console.log('  (evens stream completed)'),
});

// Every manual subscription returns a Subscription handle; unsubscribing
// stops delivery of future values and releases the resources the stream held.
const expensive$ = interval(500).pipe(map((n) => `tick #${n}`));
const subscription = expensive$.subscribe((value) => console.log(value));

// Let it run ~2.5s, then tear it down. Without this unsubscribe the interval
// would keep firing (and leaking) after we're done with it
setTimeout(() => {
  subscription.unsubscribe(); // stops the interval permanently
  console.log('  [unsubscribed the interval stream]');
}, 2500);

// ===========================================================================
// PART 3 — THE takeUntil CLEANUP PATTERN
// ===========================================================================
// One notifier Subject ties the lifetime of many streams to a single "stop" signal
// instead of juggling a separate unsubscribe() per subscription. When destroy$.next()
// fires, every stream piped through takeUntil(destroy$) completes itself automatically.
console.log('\n=== PART 3: takeUntil cleanup pattern ===');

const destroy$ = new Subject<void>();

// Two independent streams, both bound to the same notifier in their template.
const joins$ = interval(120).pipe(takeUntil(destroy$)).subscribe((n) => {
  console.log('stream A:', n);
});
const other$ = interval(300).pipe(takeUntil(destroy$)).subscribe((n) => {
  console.log('stream B:', n);
});

// Fire the notifier: both streams complete together. In a real Angular
// component this call would live in ngOnDestroy().
setTimeout(() => {
  destroy$.next();
  destroy$.complete();
  console.log('  [destroy$ fired — both streams completed]');
}, 1600);

// ===========================================================================
// PART 4 — SUBJECTS: MULTICASTING (§4)
// ===========================================================================
// A Subject is both an Observer (you push into it with .next) and an
// Observable (you subscribe to it). Unlike a plain Observable it MULTICASTS:
// every subscriber sees every value that is pushed while they are subscribed.
console.log('\n=== PART 4: Subjects ===');

// --- 4a. Subject — no memory of the past ---
// A late subscriber gets NOTHING that was emitted before they joined; they
// only see values pushed afterwards.
const plainSubject = new Subject<string>();
plainSubject.subscribe((v) => console.log('  plain (joined early):', v));

plainSubject.next('first event');
plainSubject.next('second event');

plainSubject.subscribe((v) => console.log('  plain (joined late):', v)); // late!
plainSubject.next('third event');
// The late listener saw ONLY 'third event' — it missed the first two. The
// early listener saw all three.

// --- 4b. BehaviorSubject — always exposes the CURRENT value ---
// Requires an initial value and immediately hands it to new subscribers.
const behaviorSubject = new BehaviorSubject<string>('guest');
behaviorSubject.subscribe((v) => console.log('  behavior (joined early):', v));

behaviorSubject.next('alice');

behaviorSubject.subscribe((v) => console.log('  behavior (joined late):', v));
// The late subscriber received 'alice' (the latest value) immediately — even
// though that value was emitted before they joined.

// --- 4c. ReplaySubject — replays a buffer of PAST values ---
// New subscribers are replayed the last N values in order.
const replaySubject = new ReplaySubject<string>(2); // buffer the last 2
replaySubject.next('green');
replaySubject.next('blue');
replaySubject.next('red'); // pushes 'green' out of the buffer

replaySubject.subscribe((v) => console.log('  replay (joined late):', v));
// The late subscriber received 'blue', then 'red' — the two most recent values
// replayed in order.

// --- 4d. AsyncSubject — only the FINAL value, and only on complete ---
// Buffers the last value and emits it once and only once when .complete() is
// called. Good for "give me the eventual result" flows.
const asyncSubject = new AsyncSubject<number>();
asyncSubject.subscribe((v) => console.log('  async delivered:', v));

asyncSubject.next(1);
asyncSubject.next(2);
asyncSubject.next(3); // nothing appears yet...
asyncSubject.complete();      // ...until completion finally emits the last value
