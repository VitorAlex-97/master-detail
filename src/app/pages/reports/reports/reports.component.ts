import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  months = [
    {month: 'janeiro', value: 1},
    {month: 'fevereiro', value: 2},
    {month: 'março', value: 3},
    {month: 'abril', value: 4},
    {month: 'maio', value: 5},
    {month: 'junho', value: 6},
    {month: 'julio', value: 7},
    {month: 'agosto', value: 8},
    {month: 'setembro', value: 9},
    {month: 'outubro', value: 10},
    {month: 'novembro', value: 11},
    {month: 'dezembro', value: 12}
  ];

  years = [
    {year: 2016},
    {year: 2017},
    {year: 2018},
    {year: 2019},
    {year: 2020}
  ]

  constructor() { }

  ngOnInit(): void {
  }

  generateReports() {
    
  }

}
