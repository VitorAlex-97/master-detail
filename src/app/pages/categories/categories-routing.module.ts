import { CategoryListComponent } from './category-list/category-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryFormComponent } from './category-form/category-form.component';

const routes: Routes = [
  { 
    path: '', 
    component: CategoryFormComponent 
  },
  { 
    path: 'new', 
    component: CategoryListComponent 
  },
  { 
    path: ':id/edit',
    component: CategoryListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
