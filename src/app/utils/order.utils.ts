import { computed, Signal } from '@angular/core';
import { Post } from '../models/post.model';

export function orderPostsByDate(posts: any[]): Signal<Post[]> {
  return computed(() =>
    posts.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
}
