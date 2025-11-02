import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize } from 'rxjs';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'post-editor',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatChipsModule,
    AngularEditorModule,
  ],
  templateUrl: './post-editor.html',
  styleUrls: ['./post-editor.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostEditorComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  postId?: string;
  preview?: string | null;
  isLoading = false;
  announcer = inject(LiveAnnouncer);
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '20vh',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    sanitize: true,
    toolbarPosition: 'top',
  };

  readonly tags = signal<string[]>([]);

  constructor(
    private fb: FormBuilder,
    private service: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      imageBase64: [null],
      slug: [''],
      tags: [''],
      directoryRoute: [''],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.service
        .getById(id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (post) => {
            this.isEdit = true;
            this.postId = post.id.toString();
            this.form.patchValue({
              id: post.id,
              title: post.title,
              content: post.content,
              imageBase64: post.imageBase64 || null,
              slug: post.slug,
              tags: post.tags ? post.tags.join(', ') : '',
              directoryRoute: post.directoryRoute || '',
            });
            this.preview = post.imageBase64 || null;
            this.tags.set(post.tags || []);
          },
          error: (error) => {
            console.error('Error loading post:', error);
            this.snackBar.open('Error al cargar el post', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigateByUrl('/');
          },
        });
    }
  }

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Solo se permiten archivos de imagen', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    if (file.size > 2_500_000) {
      if (!confirm('La imagen es grande. ¿Continuar?')) return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base = String(reader.result);
      this.form.patchValue({ imageBase64: base });
      this.preview = base;
    };
    reader.readAsDataURL(file);
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[áäàâã]/g, 'a')
      .replace(/[éëèê]/g, 'e')
      .replace(/[íïìî]/g, 'i')
      .replace(/[óöòôõ]/g, 'o')
      .replace(/[úüùû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Form Value:', this.form.value);

    const payload = {
      title: this.form.value.title,
      content: this.form.value.content,
      imageBase64: this.form.value.imageBase64,
      slug: this.form.value.slug || this.generateSlug(this.form.value.title),
      tags: this.form.value.tags ? this.form.value.tags : [],
      directoryRoute: this.form.value.directoryRoute || '',
    };

    this.isLoading = true;

    if (this.isEdit && this.postId) {
      this.service
        .update(this.postId, payload)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: () => {
            this.snackBar.open('Post actualizado correctamente', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigateByUrl('/');
          },
          error: (error) => {
            console.error('Error updating post:', error);
            this.snackBar.open('Error al actualizar el post', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    } else {
      this.service
        .create(payload)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: () => {
            this.snackBar.open('Post creado correctamente', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigateByUrl('/');
          },
          error: (error) => {
            console.error('Error creating post:', error);
            this.snackBar.open('Error al crear el post', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.update((tags) => [...tags, value]);
    }
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    this.tags.update((tags) => {
      const index = tags.indexOf(tag);
      if (index < 0) {
        return tags;
      }

      tags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
      return [...tags];
    });
  }

  edit(tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tag if it no longer has a name
    if (!value) {
      this.remove(tag);
      return;
    }

    // Edit existing tag
    this.tags.update((tags) => {
      const index = tags.indexOf(tag);
      if (index >= 0) {
        tags[index] = value;
        return [...tags];
      }
      return tags;
    });
  }
}
