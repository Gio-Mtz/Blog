import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { PostItemComponent } from '../post-item/post-item';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'post-list',
  imports: [CommonModule, RouterModule, PostItemComponent, MatButtonModule, MatIconModule],
  templateUrl: './post-list.html',
  styleUrls: ['./post-list.scss'],
})
export class PostListComponent {
  private service = inject(PostService);
  posts = this.service.list();

  onDelete(id: string) {
    if (!confirm('¿Borrar post?')) return;
    this.service.delete(id);
    this.posts = this.service.list();
  }
}
