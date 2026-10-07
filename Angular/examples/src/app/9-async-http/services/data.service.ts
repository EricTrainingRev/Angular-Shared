import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/** A single post returned by the JSONPlaceholder API. */
export interface Post {
  userId: number;
  id: number;
  title: string;
}

/**
 * DataService wraps the HttpClient call to fetch posts. Putting the HTTP call
 * in a service (rather than in the component) is the idiomatic Angular shape:
 * the component stays thin and focused on rendering, the service is easy to
 * reuse from other components, and the call can be swapped for a fake in tests
 * without touching the component.
 *
 * providedIn: 'root' makes this a singleton available app-wide — the same
 * instance is injected everywhere, so there is only one HttpClient wrapper.
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  // inject() asks the DI system for the HttpClient. It is provided app-wide by
  // provideHttpClient() in app.config.ts — without that provider, this inject
  // would throw at runtime.
  private readonly http = inject(HttpClient);

  /**
   * Returns an Observable<Post[]> rather than the posts themselves. An
   * Observable is LAZY: nothing happens until something subscribes. That lets
   * the caller (AsyncPipe in the template, or a manual subscribe) own when the
   * request fires and how the result is cleaned up. The HttpClient returns an
   * Observable that emits once with the parsed JSON and then completes.
   */
  fetchPosts(): Observable<Post[]> {
    return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  }
}
