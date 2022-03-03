import { AfterContentChecked, OnInit, Injector, Injectable, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Injectable()
export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessage: string[];
  submittingForm: boolean = false;

  
  protected router: Router;
  protected route: ActivatedRoute;
  protected formBuilder: FormBuilder;
  protected toastr: ToastrService;

  constructor(
    protected injector: Injector,
    @Inject('resource') public resource: T,
    protected resourceService: BaseResourceService<T>,
    @Inject('jsonDataToResourceFn') protected jsonDataToResourceFn: (jsonData: any) => T 
  ) { 
      this.router = this.injector.get(Router);
      this.route = this.injector.get(ActivatedRoute);
      this.formBuilder = this.injector.get(FormBuilder);
      this.toastr = this.injector.get(ToastrService);
  }

  ngOnInit(){
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked() {     
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    
    if(this.currentAction == 'new') {
      this.createResource()
    } else {
      this.updateResource()
    }
  }

  // PROTECTED METHODS
  protected setCurrentAction() {
    // categories/edit ou cate
    let action: string;
    this.route.snapshot.url[0].path == 'new' ? (action = 'new') : (action = 'edit');
    
    this.currentAction = action;
  }

  protected loadResource() {
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

      this.resourceService.getById(id).subscribe({
        next: (resource) => {
          this.resource = resource;

          //binds loaded resource data to ResourceForm
          this.resourceForm.patchValue(resource);
        },
        error: () => alert("Ocorreu um erro no servidor, tente mais tarde")
      });
    }
  }

  protected setPageTitle() {
    if(this.currentAction == 'new') {
      this.pageTitle = this.creationPageTitle();
    } else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string {
      return 'Novo';
  }

  protected editionPageTitle(): string {
      return 'Edição';
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)

    console.log(resource);

    this.resourceService.create(resource).subscribe({
      next: (resource) => {
        this.actionsForSuccess(resource);
      },
      error: (error) => this.actionForError(error),
      complete: () => {}
    })
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)

    this.resourceService.update(resource).subscribe({
      next: (resource) => {
        this.actionsForSuccess(resource);
      },
      error: (error) => this.actionForError(error),
      complete: () => {}
    });
  }


  protected actionsForSuccess(resource: T) {
    this.toastr.success('Solicitação processada com sucesso!');

    const baseComponentPath = String(this.route.snapshot.parent?.url[0].path);

    // rederect/reload component page
    this.router.navigateByUrl(baseComponentPath,{skipLocationChange: true}).then(() => {
      this.router.navigate([baseComponentPath, resource.id, 'edit']);
      console.log(resource)
    });
  }

  protected actionForError(error: any) {
    this.toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if(error.status === 422) {
      this.serverErrorMessage = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessage = ['Falha na comunicação com o servidor. Por favor, tente mais tarde!'];
    }
  }


  protected abstract buildResourceForm(): void;
}
