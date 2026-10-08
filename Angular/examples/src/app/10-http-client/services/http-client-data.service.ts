import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/** A single post returned by the JSONPlaceholder API. */
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/** The shape of a post being created or updated via POST / PUT. */
export interface PostDraft {
  userId: number;
  title: string;
  body: string;
}

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

/**
 * HttpClientDataService wraps every HttpClient call behind a typed method.
 * Keeping the HTTP in a service (rather than the component) is the idiomatic
 * Angular shape: the component stays thin and rendering-focused, the service
 * is reusable, and each call can be swapped for a fake in tests without
 * touching the component.
 *
 * Every method returns an Observable<...> with a generic type argument, so the
 * response JSON is parsed with that type. HttpClient requests are LAZY — they
 * only fire when something subscribes.
 *
 * providedIn: 'root' makes this a singleton available app-wide. The HttpClient
 * is injected via inject() and is provided by provideHttpClient() in
 * app.config.ts.
 */
@Injectable({ providedIn: 'root' })
export class HttpClientDataService {
  private readonly http = inject(HttpClient);

  /** GET /posts — retrieve the full list of posts. */
  fetchPosts(): Observable<Post[]> {
    // the type we provide as the generic tells our application what structure the
    // response body takes
    return this.http.get<Post[]>(API_URL);
  }

  /** POST /posts — create a new post from a draft, returning the stored post. */
  createPost(draft: PostDraft): Observable<Post> {
    return this.http.post<Post>(API_URL, draft);
  }

  /** PUT /posts/:id — replace an existing post, returning the updated post. */
  updatePost(id: number, draft: PostDraft): Observable<Post> {
    return this.http.put<Post>(`${API_URL}/${id}`, draft);
  }

  /** DELETE /posts/:id — remove a post. No body is returned. */
  deletePost(id: number): Observable<void> {
    // use the void generic to indicate no body in the response
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

  /**
   * GET /posts?userId=N — retrieve only the posts written by one user.
   * HttpParams builds the query string immutably: each .set() returns a new
   * params object rather than mutating the old one.
   */
  fetchPostsByUser(userId: number): Observable<Post[]> {
    // the value of the param can be string, number, or boolean
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Post[]>(API_URL, { params });
    // the { params } above is equivalent to the example below
    // {
    //   params: params;
    // }
  }

  /**
   * GET /posts with a custom header. HttpHeaders is also immutable — .set()
   * returns a new headers object. The header is sent with the request; the
   * JSONPlaceholder API ignores it, but a real backend could read it.
   */
  fetchPostsWithHeader(): Observable<Post[]> {
    let headers = new HttpHeaders().set('X-Demo-Header', 'http-client-demo');
    headers = headers.set("Authorization", "Bearer my-auth-token-here");
    headers = headers.set("OPENAI_ESQUE_API_KEY", "my-api-key-here");
    return this.http.get<Post[]>(API_URL, { headers });
  }

  /**
   * GET /posts returning the FULL HttpResponse instead of just the body.
   * observe: 'response' changes what the Observable emits: instead of the
   * parsed Post[] body, it emits an HttpResponse<Post[]> carrying the status
   * code, headers, and body together.
   */
  fetchPostsResponse(): Observable<HttpResponse<Post[]>> {
    return this.http.get<Post[]>(API_URL, { observe: 'response' });
  }

  /**
   * GET /posts/:id — fetch a single post. Requesting a non-existent id (e.g.
   * 99999910) makes the server respond with HTTP 404, which HttpClient surfaces
   * as an HttpErrorResponse with status 404.
   */
  fetchPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${API_URL}/${id}`);
  }

  /**
   * GET to a deliberately unreachable host. The request never reaches a server,
   * so HttpClient surfaces a network-level HttpErrorResponse with status 0 —
   * the signal that the failure happened before any HTTP response arrived.
   */
  fetchFromUnreachableHost(): Observable<Post[]> {
    return this.http.get<Post[]>('https://this-host-does-not-exist.invalid/posts');
  }
}
