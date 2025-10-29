import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list';
import { PostEditorComponent } from './components/post-editor/post-editor';

export const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'new', component: PostEditorComponent },
  { path: 'edit/:id', component: PostEditorComponent },
  { path: '**', redirectTo: '' },
];
