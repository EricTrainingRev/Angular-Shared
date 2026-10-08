import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { EMPTY, Observable, catchError } from 'rxjs';

import { HttpClientDataService, Post, PostDraft } from './services/http-client-data.service';

/** The lifecycle of an HTTP request, driving the loading / error / data states. */
type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * The HttpClient page. Step 2 adds the HTTP verbs (GET / POST / PUT / DELETE)
 * plus typed generics and a JSON request body. Step 3 adds request
 * customization (HttpParams / HttpHeaders) and observe: 'response'. Step 4
 * adds typed error handling (HTTP status vs. network failures).
 *
 * Every request goes through HttpClientDataService, which returns a typed
 * Observable. Each verb holds its own state signal so its loading / error /
 * data cards stay independent. OnPush means the page re-renders only when one
 * of these signals changes.
 *
 * Error handling note: catchError returns EMPTY (not a fallback value) so the
 * success callback never runs after a failure. Returning a value like of(null)
 * would let the subscribe() handler fire with null and overwrite the error
 * state with 'success' — the readout would silently disappear.
 */
@Component({
  selector: 'app-http-client-demo',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './http-client-demo.html',
  styleUrl: './http-client-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpClientDemo {
  private readonly dataService = inject(HttpClientDataService);

  // --- Section 1: HTTP Verbs ---

  // GET /posts — retrieve everything.
  protected readonly getStatus = signal<FetchStatus>('idle');
  protected readonly posts = signal<Post[]>([]);
  protected readonly getError = signal('');

  // The same GET rendered with the AsyncPipe instead of a manual subscribe.
  // The Observable is stored in a signal and the template subscribes with
  // `| async`, so Angular owns the subscription lifecycle (auto-unsubscribe on
  // destroy). It is set at the same time as the manual GET below, so both
  // consumption patterns fire together and can be compared.
  protected readonly asyncPosts = signal<Observable<Post[]> | null>(null);

  protected loadPosts(): void {
    this.getStatus.set('loading');
    this.getError.set('');
    this.asyncPosts.set(this.dataService.fetchPosts());
    this.dataService
      .fetchPosts()
      .pipe(
        catchError(() => {
          this.getError.set('Could not load posts.');
          this.getStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((posts) => {
        this.posts.set(posts);
        this.getStatus.set('success');
      });
  }

  // POST /posts — create from the draft.
  protected readonly postStatus = signal<FetchStatus>('idle');
  protected readonly createdPost = signal<Post | null>(null);
  protected readonly postError = signal('');

  protected createPost(): void {
    this.postStatus.set('loading');
    this.postError.set('');
    this.dataService
      .createPost(this.buildDraft())
      .pipe(
        catchError(() => {
          this.postError.set('Could not create the post.');
          this.postStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((post) => {
        this.createdPost.set(post);
        this.postStatus.set('success');
      });
  }

  // PUT /posts/:id — replace a real seeded post with the current draft.
  // JSONPlaceholder only lets you mutate the seeded posts (ids 1–100), not the
  // post created by POST (which gets a synthetic id like 101), so we target a
  // fixed real post here to keep the demo succeeding.
  protected readonly putStatus = signal<FetchStatus>('idle');
  protected readonly updatedPost = signal<Post | null>(null);
  protected readonly putError = signal('');

  protected updatePost(): void {
    const id = 1;
    this.putStatus.set('loading');
    this.putError.set('');
    this.dataService
      .updatePost(id, this.buildDraft())
      .pipe(
        catchError(() => {
          this.putError.set(`Could not update post ${id}.`);
          this.putStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((post) => {
        this.updatedPost.set(post);
        this.putStatus.set('success');
      });
  }

  // DELETE /posts/:id — remove a real seeded post.
  protected readonly deleteStatus = signal<FetchStatus>('idle');
  protected readonly deletedId = signal<number | null>(null);
  protected readonly deleteError = signal('');

  protected deletePost(): void {
    const id = 1;
    this.deleteStatus.set('loading');
    this.deleteError.set('');
    this.dataService
      .deletePost(id)
      .pipe(
        catchError(() => {
          this.deleteError.set(`Could not delete post ${id}.`);
          this.deleteStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.deletedId.set(id);
        this.deleteStatus.set('success');
      });
  }

  // --- Section 3: Request Customization ---
  // HttpParams builds the query string (e.g. ?userId=1) and HttpHeaders adds
  // custom headers to the request. Both are immutable: .set() returns a new
  // object rather than mutating the old one.
  protected readonly filterStatus = signal<FetchStatus>('idle');
  protected readonly filteredPosts = signal<Post[]>([]);
  protected readonly filterError = signal('');
  protected readonly userId = signal(1);

  protected updateUserId(value: string): void {
    this.userId.set(Number(value) || 0);
  }

  protected loadPostsByUser(): void {
    this.filterStatus.set('loading');
    this.filterError.set('');
    this.dataService
      .fetchPostsByUser(this.userId())
      .pipe(
        catchError(() => {
          this.filterError.set('Could not filter posts.');
          this.filterStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((posts) => {
        this.filteredPosts.set(posts);
        this.filterStatus.set('success');
      });
  }

  // A second customization: send a custom header with the request. The header
  // is built in the service; here we just trigger it and show the result.
  protected readonly headerStatus = signal<FetchStatus>('idle');
  protected readonly headerPosts = signal<Post[]>([]);
  protected readonly headerError = signal('');

  protected loadPostsWithHeader(): void {
    this.headerStatus.set('loading');
    this.headerError.set('');
    this.dataService
      .fetchPostsWithHeader()
      .pipe(
        catchError(() => {
          this.headerError.set('Could not load posts with header.');
          this.headerStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((posts) => {
        this.headerPosts.set(posts);
        this.headerStatus.set('success');
      });
  }

  // --- Section 4: observe: 'response' ---
  // By default HttpClient emits just the parsed body. With observe: 'response'
  // it emits the full HttpResponse, so we can read the status code and headers
  // alongside the body.
  protected readonly responseStatus = signal<FetchStatus>('idle');
  protected readonly response = signal<HttpResponse<Post[]> | null>(null);
  protected readonly responseError = signal('');

  protected loadPostsResponse(): void {
    this.responseStatus.set('loading');
    this.responseError.set('');
    this.dataService
      .fetchPostsResponse()
      .pipe(
        catchError(() => {
          this.responseError.set('Could not load the full response.');
          this.responseStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((res) => {
        this.response.set(res);
        this.responseStatus.set('success');
      });
  }

  // --- Section 5: Error Handling ---
  // HttpClient surfaces every failure as an HttpErrorResponse. Its .status is
  // the HTTP status code for server errors (e.g. 404), or 0 for network-level
  // failures that never reached a server. We branch on that to tell the two
  // apart and show a distinct message for each.
  protected readonly httpErrorStatus = signal<FetchStatus>('idle');
  protected readonly httpErrorMessage = signal('');
  protected readonly httpErrorKind = signal('');

  protected loadMissingPost(): void {
    this.httpErrorStatus.set('loading');
    this.httpErrorMessage.set('');
    this.httpErrorKind.set('');
    this.dataService
      .fetchPost(99999910)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.httpErrorKind.set('HTTP status error');
          this.httpErrorMessage.set(`Server responded with status ${err.status} (${err.statusText}).`);
          this.httpErrorStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.httpErrorStatus.set('success');
      });
  }

  protected loadUnreachableHost(): void {
    this.httpErrorStatus.set('loading');
    this.httpErrorMessage.set('');
    this.httpErrorKind.set('');
    this.dataService
      .fetchFromUnreachableHost()
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.httpErrorKind.set('Network error');
          this.httpErrorMessage.set(
            `Request never reached a server (status ${err.status}). Check your connection.`,
          );
          this.httpErrorStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.httpErrorStatus.set('success');
      });
  }

  // --- Section 2: Typed Generics & JSON Body ---
  // Two inputs build a PostDraft — a typed object passed as the JSON body of
  // POST and PUT. The generic type argument on each service method tells
  // HttpClient what shape to parse the response into.
  protected readonly draftTitle = signal('Built by HttpClient');
  protected readonly draftBody = signal('This object is sent as the JSON request body.');

  protected updateDraftTitle(value: string): void {
    this.draftTitle.set(value);
  }

  protected updateDraftBody(value: string): void {
    this.draftBody.set(value);
  }

  protected buildDraft(): PostDraft {
    return { userId: 1, title: this.draftTitle(), body: this.draftBody() };
  }
}
