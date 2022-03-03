import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { Entry } from './../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {
  
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
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    protected injetor: Injector
  ) {
    super(injetor, new Entry(), entryService, Entry.fromJson)
   }

   override ngOnInit() {
    super.ngOnInit();
    this.loadCategories();
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

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  protected override creationPageTitle(): string {
    return 'Cadastro de Novo Lançamento'
  }

  protected override editionPageTitle(): string {
    const resourceName = this.resource.name || '';

    return 'Editando Lançamento: ' + resourceName;
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
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

  get nameControl() {
    return this.resourceForm.get('name');
  }


}
