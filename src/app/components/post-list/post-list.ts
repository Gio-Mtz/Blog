import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { PostItemComponent } from '../post-item/post-item';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  ],
  templateUrl: './post-list.html',
  styleUrls: ['./post-list.scss'],
})
export class PostListComponent {
  private service = inject(PostService);
  private snackBar = inject(MatSnackBar);

  posts = this.service.posts;

  onDelete(id: string) {
    this.snackBar.open('¿Desea eliminar el post?', 'Cancelar', {
      duration: 3000,
      verticalPosition: 'top',
    });

    if (!confirm('¿Borrar post?')) return;

    this.service.delete(id).subscribe({
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
}
