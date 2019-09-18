import { Component, OnInit, Input } from '@angular/core';
import { Invoice, InvoiceSummary } from '../model/item';

@Component({
  selector: 'app-invoice-summary',
  templateUrl: './invoice-summary.component.html',
  styleUrls: ['./invoice-summary.component.scss']
})
export class InvoiceSummaryComponent implements OnInit {

  @Input()
  summary: InvoiceSummary;

  constructor() { }

  ngOnInit() {
  }

}
