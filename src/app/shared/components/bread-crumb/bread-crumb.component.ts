import { Component, Input, OnInit } from '@angular/core';

interface BradCrumbItem {
  text: string,
  link?: string
}

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {

  @Input() items: BradCrumbItem[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  isTheLastItem(item: BradCrumbItem): boolean {
    const index = this.items.indexOf(item);
    
    return (index ==  this.items.length - 1); 
  }

}
