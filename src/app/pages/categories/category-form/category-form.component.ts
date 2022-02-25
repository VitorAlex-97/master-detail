import { Category } from './../shared/category.model';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryService } from '../shared/category.service';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessage: string[];
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(){
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {     
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    
    if(this.currentAction == 'new') {
      this.createCategory()
    } else {
      this.updateCategory()
    }

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
      description: [null]
    });
  }

  private loadCategory() {
    if(this.currentAction == "edit") {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      console.log(id);
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

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category).subscribe({
      next: (category) => {
        this.actionsForSuccess(category);
      },
      error: (error) => this.actionForError(error),
      complete: () => {}
    })
  }

  private actionsForSuccess(category: Category) {
    this.toastr.success('Solicitação processada com sucesso!');

    // rederect/reload component page
    this.router.navigateByUrl('categories',{skipLocationChange: true}).then(() => {
      this.router.navigate(['categories', category.id, 'edit']);
      console.log(category)
    });
  }

  private actionForError(error: any) {
    this.toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if(error.status === 422) {
      this.serverErrorMessage = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessage = ['Falha na comunicação com o servidor. Por favor, tente mais tarde!'];
    }
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category).subscribe({
      next: (category) => {
        this.actionsForSuccess(category);
      },
      error: (error) => this.actionForError(error),
      complete: () => {}
    });
  }



}
