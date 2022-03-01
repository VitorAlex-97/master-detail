import { Category } from './../../categories/shared/category.model';
import { CategoryService } from './../../categories/shared/category.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, Observable, throwError } from 'rxjs';

import { Entry } from './entry.model';


@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = 'api/entries';

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) { }

  getAll(): Observable<Entry[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    )
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: Entry): Observable<Entry> {
  console.log(entry.categoryId);
   return this.categoryService.getById(Number(entry.categoryId)).pipe(
      mergeMap((category) => {
        entry.category = category;
        
        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        );
      })
    );
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;
    
    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
    )
  }

  delete(id: number): Observable <any>{
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  
  private jsonDataToEntries(jsonData: any []): Entry[] {
    let entries: Entry[] = [];

    jsonData.forEach((element) => {
      const entry = Object.assign(new Entry(), element);
      entries.push(entry);
    });

    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na requisição', error);
  
    return throwError(() => new Error (error));
  }
}
