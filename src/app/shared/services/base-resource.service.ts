import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { BaseResourceModel } from "../models/base-resource.model";

export abstract class  BaseResourceService<T extends BaseResourceModel> {

    protected http: HttpClient

    constructor(protected apiPath: string, protected injector: Injector){
        this.http = injector.get(HttpClient)
    }

    getAll(): Observable<T[]> {
        return this.http.get(this.apiPath).pipe(
          catchError(this.handleError),
          map(this.jsonDataToResources)
        )
      }
    
      getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`;
    
        return this.http.get(url).pipe(
          catchError(this.handleError),
          map(this.jsonDataToResource)
        )
      }
    
      create(resourse: T): Observable<T> {
        return this.http.post(this.apiPath, resourse).pipe(
          catchError(this.handleError),
          map(this.jsonDataToResource)
        )
      }
    
      update(resourse: T): Observable<T> {
        const url = `${this.apiPath}/${resourse.id}`;
        
        return this.http.put(url, resourse).pipe(
          catchError(this.handleError),
          map(() => resourse)
        )
      }
    
      delete(id: number): Observable <any>{
        const url = `${this.apiPath}/${id}`;
    
        return this.http.delete(url).pipe(
          catchError(this.handleError),
          map(() => null)
        );
      }


      // PROTECTED METHODS
      protected jsonDataToResources(jsonData: any []): T[] {
        let resources: T[] = [];
        jsonData.forEach((element) => {
          resources.push(element as T);
        });
        return resources;
      }
    
      protected jsonDataToResource(jsonData: any): T {
        return jsonData as T;
      }
    
      protected handleError(error: any): Observable<any> {
        console.log('Erro na requisição', error);
      
        return throwError(() => new Error (error));
      }
    
}