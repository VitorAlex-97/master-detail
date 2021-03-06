import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  @Input('page-tile') pageTitle: string;
  @Input('show-button') showButton: boolean = true;
  @Input('button-class') buttonClass: string;
  @Input('button-text') buttonTex: string;
  @Input('button-link') buttonLink: string;

  constructor() { }

  ngOnInit() {

  }

}
