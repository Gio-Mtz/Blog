import { Injectable, signal, computed } from '@angular/core';
import { Post } from '../models/post.model';

const STORAGE_KEY = 'blog.posts.v1';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postsSignal = signal<Post[]>(this.loadFromStorage());

  readonly posts = computed(() => this.postsSignal());

  private loadFromStorage(): Post[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Post[];
    } catch (e) {
      console.error('Error loading posts from storage', e);
      return [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.postsSignal()));
    } catch (e) {
      console.error('Error saving posts to storage', e);
    }
  }

  list(): Post[] {
    return this.postsSignal();
  }

  getById(id: string): Post | undefined {
    return this.postsSignal().find((p) => p.id === id);
  }

  create(payload: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const post: Post = {
      ...payload,
      id: String(Date.now()) + Math.random().toString(36).slice(2, 9),
      createdAt: now,
      updatedAt: now,
    };
    this.postsSignal.update((prev) => [post, ...prev]);
    this.saveToStorage();
    return post;
  }

  update(id: string, patch: Partial<Post>) {
    let updated: Post | undefined;
    this.postsSignal.update((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        updated = { ...p, ...patch, updatedAt: new Date().toISOString() };
        return updated!;
      })
    );
    this.saveToStorage();
    return updated;
  }

  delete(id: string) {
    this.postsSignal.update((prev) => prev.filter((p) => p.id !== id));
    this.saveToStorage();
  }

  clearAll() {
    this.postsSignal.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }
}
