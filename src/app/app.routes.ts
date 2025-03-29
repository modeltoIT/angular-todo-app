import { Routes } from '@angular/router';
import { TodosPageComponent } from './components/todos-page/todos-page.component';

export const routes: Routes = [
  {path:'todos/:status', component: TodosPageComponent},
  {
    path:'about',
    loadComponent: () => import('./components/about-page/about-page.component')
      .then(c => c.AboutPageComponent)
  },
  {path:'**', redirectTo:'todos/all', pathMatch:'full'}
];
