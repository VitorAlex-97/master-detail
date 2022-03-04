import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { EntryService } from './../../entries/shared/entry.service';
import { Entry } from './../../entries/shared/entry.model';
import { Category } from './../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { unformat, format } from 'currency-formatter';

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
    {year: 2020},
    {year: 2021},
    {year: 2022}
  ];

  chartOptions = {
    scales: {
      y: {
        ticks: {
          beginAtZero: true
        }
      }
    }
  };

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  
  categories: Category[] = [];
  entries: Entry[] =[];

  @ViewChild('month') month: ElementRef;
  @ViewChild('year') year: ElementRef;

 

  constructor(
    private entryService: EntryService,
    private catgoryService: CategoryService
  ) { }

  ngOnInit() {
    this.catgoryService
    .getAll()
    .subscribe( categories => this.categories = categories);
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if(!month || !year)
      alert('Você precisa selecionar o Mês e o Ano para gerar um reltório!');
    else
      this.entryService.getByMonthAndYear(month, year)
      .subscribe(this.setValues.bind(this))
  }

  private setValues(entries: Entry[]) {
    this.entries = entries;
    this.calculeteBalance();
    this.setChartData();
  }

  private calculeteBalance() {
    let expenseTotal: number = 0;
    let revenueTotal: number = 0;

    this.entries.forEach(entry => {
      if(entry.type == 'revenue'){
        revenueTotal += unformat(String(entry.amount), {code:'BRL'});
      }
      else {
        expenseTotal += unformat(String(entry.amount), {code:'BRL'});
      }
    });
    this.expenseTotal = format(expenseTotal, {code: 'BRL'});
    this.revenueTotal = format(revenueTotal, {code: 'BRL'});
    this.balance = format((revenueTotal - expenseTotal), {code:'BRL'});
  }

  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#e03131');
  }

  private getChartData(entryType: string, title: string, color: string) {
    let chartData: any[] = [];

    this.categories.forEach(category => {
      // filtring entries by category and type
      const filteredEntries = this.entries.filter(
        entry => (entry.categoryId == category.id) && (entry.type == entryType)
      );

      // if found entries, then sum entries amount and add to chartData
      if(filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce(
          (total, entry) => total + unformat(String(entry.amount), {code: 'BRL'}), 0
        );

        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        });
      }
    });
    
    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        data: chartData.map(item => item.totalAmount)
      }]
    }
  }

}
