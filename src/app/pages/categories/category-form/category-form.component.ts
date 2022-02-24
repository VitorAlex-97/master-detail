import { Category } from './../shared/category.model';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryService } from '../shared/category.service';
import { switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessage:string[] = [];
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(){
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {     
    this.setPageTitle();
  }

  private setCurrentAction() {
    // categories/edit ou cate
    let action: string;
    this.route.snapshot.url[0].path == 'new' ? (action = 'new') : (action = 'edit');
    
    this.currentAction = action;
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      decription: [null]
    });
  }

  private loadCategory() {
    if(this.currentAction == "edit") {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      
      const errorIdZero = throwError(() => {
        const error: any = new Error(`request id is null`);
        return error;
      })
      if(id == 0) {
        errorIdZero;
      }

      this.categoryService.getById(id).subscribe({
        next: (category) => {
          this.category = category;

          //binds load category data to CategoryForm
          this.categoryForm.patchValue(category);
        },
        error: () => alert("Ocorreu um erro no servidor, tente mais tarde")
      });
    }
  }

  private setPageTitle() {
    if(this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria'
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }



}
