import { Injectable, Injector } from '@angular/core';
import { mergeMap, Observable, map } from 'rxjs';

import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { CategoryService } from './../../categories/shared/category.service';
import { Entry } from './entry.model';

import * as moment from "moment";

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

  getByMonthAndYear(month: number, year: number): Observable<Entry[]> {
   return this.getAll()
    .pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    )
  }

  private filterByMonthAndYear(entries: Entry[], month: number, year: number) {
    return entries.filter(entry => {
      const entryDate = moment(entry.date, "DD/MM/YYYY");
      const monthMatches = entryDate.month() + 1 == month;
      const yearMatches = Number(entryDate.year()) == year;

      if(monthMatches && yearMatches)
        return entry;

      return null;
    });
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
