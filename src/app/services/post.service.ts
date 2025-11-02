import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';
import { Observable, tap, map, catchError } from 'rxjs';

const API_URL = 'https://localhost:44315/api/Posts';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postsSignal = signal<Post[]>([]);
  readonly posts = computed(() => this.postsSignal());

  constructor(private http: HttpClient) {
    this.refreshPosts();
  }

  private refreshPosts() {
    this.http.get<Post[]>(API_URL).subscribe((posts) => this.postsSignal.set(posts));
  }

  list(): Post[] {
    return this.postsSignal();
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${API_URL}/${id}`);
  }

  create(payload: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Observable<Post> {
    return this.http.post<Post>(API_URL, payload).pipe(
      tap((newPost) => {
        this.postsSignal.update((posts) => [newPost, ...posts]);
      })
    );
  }

  update(id: string, patch: Partial<Post>): Observable<void> {
    return this.http.put<void>(`${API_URL}/${id}`, patch).pipe(
      tap(() => {
        const numericId = parseInt(id, 10);
        this.postsSignal.update((posts) =>
          posts.map((p) =>
            p.id === numericId ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
          )
        );
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`).pipe(
      tap(() => {
        const numericId = parseInt(id, 10);
        this.postsSignal.update((posts) => posts.filter((p) => p.id !== numericId));
      })
    );
  }

  // getGroupedByRoute(): { [route: string]: Post[] } {
  // const groups: { [route: string]: Post[] } = {};
  // for (const post of this.posts()) {
  //   if (!groups[post.directoryRoute]) groups[post.directoryRoute] = [];
  //   groups[post.directoryRoute].push(post);
  // }
  // return groups;
  // }
}
