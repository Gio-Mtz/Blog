import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list';
import { PostEditorComponent } from './components/post-editor/post-editor';
import { PostViewComponent } from './components/post-view/post-view';

export const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'new', component: PostEditorComponent },
  { path: 'edit/:id', component: PostEditorComponent },
  { path: 'view/:id', component: PostViewComponent },
  { path: '**', redirectTo: '' },
];
