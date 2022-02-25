import { Component, Input, OnInit } from '@angular/core';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(
    private entryService: EntryService
  ) { }

  ngOnInit() {
    this.entryService.getAll().subscribe({
      next: (resp) => this.entries = resp,
      error: (error) => {
        alert('Erro ao carregar a lista');
        console.log(error);
    }})
  }

  deleteEntry(entry: any) {
    const mustDelete = confirm('Deseja realmente exluir este item?');
    
    if(mustDelete){
      this.entryService.delete(entry.id).subscribe({
        next: () => this.entries = this.entries.filter((element) => element != entry),
        error: () => alert('Erro ao tentar excluir')
      })
    }
  }

}
