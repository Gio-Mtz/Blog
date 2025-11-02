import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { PostItemComponent } from '../post-item/post-item';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';

@Component({
  selector: 'post-list',
  imports: [
    CommonModule,
    RouterModule,
    PostItemComponent,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTreeModule,
  ],
  templateUrl: './post-list.html',
  styleUrls: ['./post-list.scss'],
})
export class PostListComponent implements OnInit {
  private service = inject(PostService);

  posts = this.service.posts;

  constructor() {}

  ngOnInit(): void {
    this.orderPostsByDate();
  }

  orderPostsByDate() {
    this.posts = computed(() =>
      this.service
        .posts()
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  }
}
