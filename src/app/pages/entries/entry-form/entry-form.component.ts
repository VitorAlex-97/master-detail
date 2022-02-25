import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Entry } from './../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessage: string[];
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  
  imaskConfig = {
    mask: Number,
    scale: 2,
    signed: false,
    thousandsSeparator: '.',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  categories: Category[];

  constructor(
    private entryService: EntryService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(){
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked() {     
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    
    if(this.currentAction == 'new') {
      this.createEntry()
    } else {
      this.updateEntry()
    }

  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          value: value,
          text: text
        }
      }
    )
  }

  private setCurrentAction() {
    // entries/edit ou cate
    let action: string;
    this.route.snapshot.url[0].path == 'new' ? (action = 'new') : (action = 'edit');
    
    this.currentAction = action;
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null,  [Validators.required]],
      date: [null,  [Validators.required]],
      paid: [true,  [Validators.required]],
      categoryId: [null,  [Validators.required]]
    });
  }

  private loadEntry() {
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

      this.entryService.getById(id).subscribe({
        next: (entry) => {
          this.entry = entry;

          //binds load entry data to EntryForm
          this.entryForm.patchValue(entry);
        },
        error: () => alert("Ocorreu um erro no servidor, tente mais tarde")
      });
    }
  }

  private setPageTitle() {
    if(this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de Novo Lançamento'
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando Lançamento: ' + entryName;
    }
  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    console.log(entry);

    this.entryService.create(entry).subscribe({
      next: (entry) => {
        this.actionsForSuccess(entry);
      },
      error: (error) => this.actionForError(error),
      complete: () => {}
    })
  }

  private actionsForSuccess(entry: Entry) {
    this.toastr.success('Solicitação processada com sucesso!');

    // rederect/reload component page
    this.router.navigateByUrl('entries',{skipLocationChange: true}).then(() => {
      this.router.navigate(['entries', entry.id, 'edit']);
      console.log(entry)
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

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry).subscribe({
      next: (entry) => {
        this.actionsForSuccess(entry);
      },
      error: (error) => this.actionForError(error),
      complete: () => {}
    });
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      (resp) => this.categories = resp
    );
  }



}
