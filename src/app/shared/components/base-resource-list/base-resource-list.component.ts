import { Injectable, OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Injectable()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(
    protected resourceService: BaseResourceService<T>
  ) { }

  ngOnInit() {
    this.resourceService.getAll().subscribe({
      next: (resp) => this.resources = resp.sort((a, b) => Number(b.id) - Number(a.id)),
      error: (error) => {
        alert('Erro ao carregar a lista');
        console.log(error);
    }})
  }

  deleteResource(resource: any) {
    const mustDelete = confirm('Deseja realmente exluir este item?');
    
    if(mustDelete){
      this.resourceService.delete(resource.id).subscribe({
        next: () => this.resources = this.resources.filter((element) => element != resource),
        error: () => alert('Erro ao tentar excluir')
      })
    }
  }

}
