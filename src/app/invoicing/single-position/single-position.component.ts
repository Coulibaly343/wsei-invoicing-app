import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { InvoiceItem, Unit, Tax } from '../model/item';
import { PriceCalculator, ItemPrice } from '../model/price-calculation/price-calculator';
import { ItemCatalog } from '../model/item-catalog/item-catalog';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, tap, map, retry, filter } from 'rxjs/operators';
import { Item } from '../model/item-catalog/item';

interface ItemSuggestion {
  name: string;
  label: string;
}

@Component({
  selector: 'app-single-position',
  templateUrl: './single-position.component.html',
  styleUrls: ['./single-position.component.scss']
})
export class SinglePositionComponent implements OnInit {
  readonly WAIT_TIME_BEFORE_SEARCH = 400;
  readonly MINIMAL_QUERY_LENGTH = 3;

  @Input()
  private position: InvoiceItem;
  @Input()
  private lp: number;

  private availableUnits: Unit[] = [
    Unit.good,
    Unit.hour,
    Unit.service
  ];

  private availableTaxes: Tax[] = [
    Tax.t23,
    Tax.t8,
    Tax.t5
  ];

  @Output()
  private itemRemoved: EventEmitter<InvoiceItem> = new EventEmitter<InvoiceItem>();

  @Output()
  private positionChanged: EventEmitter<InvoiceItem> = new EventEmitter();

  private searchQuery = new Subject<string>();
  private searchResult = this.searchQuery.pipe(
      debounceTime(this.WAIT_TIME_BEFORE_SEARCH),
      filter(q => q.length >= this.MINIMAL_QUERY_LENGTH),
      switchMap( q => this.itemsCatalog.items(q)),
      map(data => this.toAnotherForm(data)),
      tap(data => console.log(data)),
      retry(3),
  );

  suggestions: ItemSuggestion[] = [];

  constructor(
    private priceCalculator: PriceCalculator,
    private itemsCatalog: ItemCatalog
  ) {}

  ngOnInit() {
    this.position.tax = Tax.t23
    
    this.searchResult.subscribe((items) => {
      this.suggestions = items;
    });
  }

  removePosition(): void {
    this.itemRemoved.next(this.position);
  }

  handleChangeNetto(): void {
    const res = this.priceCalculator.calculate({
      netto: this.position.netto,
      gross: null,
      tax: this.position.tax
    });

    this.updateAccordingToResult(res);
  }

  handleChangeBrutto(): void {
    const res = this.priceCalculator.calculate({
      netto: null,
      gross: this.position.brutto,
      tax: this.position.tax
    });

    this.updateAccordingToResult(res);
  }

  handleChangeTax(): void {
    const res = this.priceCalculator.calculate({
      netto: this.position.netto,
      gross: this.position.brutto,
      tax: this.position.tax
    });

    this.updateAccordingToResult(res);
  }

  handleAutocompleteName($event: any): void {
    this.searchQuery.next($event.target.value);
  }

  private updateAccordingToResult(res: ItemPrice) {
    this.position.brutto = res.gross;
    this.position.netto = res.net;
    this.positionChanged.next(this.position);
  }

  toAnotherForm(data: Item[]): ItemSuggestion[] {
    return data.map(i => {
      return {
        name: i.name,
        label: i.name
      };
    });
  }

  selectSuggestion(item: ItemSuggestion): void {
    this.position.name = item.name;
    this.suggestions = [];
  }
}
