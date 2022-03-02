import { Injectable, Injector } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';

import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { CategoryService } from './../../categories/shared/category.service';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injetor: Injector, private categoryService: CategoryService) {
    super('api/entries', injetor, Entry.fromJson)
   }

  override create (entry: Entry): Observable<Entry> {
  console.log(entry.categoryId);
   return this.categoryService.getById(Number(entry.categoryId)).pipe(
      mergeMap((category) => {
        entry.category = category; 
        return super.create(entry);
      })
    );
  }

  override update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      mergeMap((category) => {
        entry.category = category;
        return super.update(entry);
      })
    );
  }

  /*
  
  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry> {
    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      mergeMap((category) => {
        entry.category = category;
        return sendFn(entry)
      })
    )
  }
  
  */
}
