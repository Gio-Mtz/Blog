import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Injector,
  OnInit,
  Output,
} from '@angular/core';
import { Post } from '../../models/post.model';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PostService } from '../../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-view',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './post-view.html',
  styleUrl: './post-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostViewComponent {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private snackBar = inject(MatSnackBar);
  private location = inject(Location);

  postId = Number(this.route.snapshot.paramMap.get('id'));
  post = computed(() => this.postService.posts().find((p) => p.id === this.postId));

  onDelete(id: number) {
    if (!confirm('¿Borrar post?')) return;

    this.postService.delete(id.toString()).subscribe({
      next: () => {
        this.snackBar.open('Post eliminado correctamente', 'Cerrar', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error al eliminar el post:', error);
        this.snackBar.open('Error al eliminar el post', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
