import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'post-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './post-editor.html',
  styleUrls: ['./post-editor.scss'],
})
export class PostEditorComponent implements OnInit {
  form: FormGroup;

  isEdit = false;
  postId?: string;
  preview?: string | null;

  constructor(
    private fb: FormBuilder,
    private service: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      imageBase64: [null],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.service.getById(id);
      if (!found) {
        // if not found, go back to list
        this.router.navigateByUrl('/');
        return;
      }
      this.isEdit = true;
      this.postId = found.id;
      this.form.patchValue({
        title: found.title,
        content: found.content,
        imageBase64: found.imageBase64 || null,
      });
      this.preview = found.imageBase64 || null;
    }
  }

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file.size > 2_500_000) {
      // ~2.5MB limit warn
      if (!confirm('La imagen es grande y se guardará en localStorage. ¿Continuar?')) return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base = String(reader.result);
      this.form.patchValue({ imageBase64: base });
      this.preview = base;
    };
    reader.readAsDataURL(file);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = {
      title: this.form.value.title,
      content: this.form.value.content,
      imageBase64: this.form.value.imageBase64,
    };

    if (this.isEdit && this.postId) {
      this.service.update(this.postId, payload as Partial<Post>);
    } else {
      this.service.create(payload as Omit<Post, 'id' | 'createdAt' | 'updatedAt'>);
    }

    this.router.navigateByUrl('/');
  }
}
