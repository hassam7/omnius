import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThItemInterface {
  text: string;
  value: any;
  checked: boolean;
}

type ThFilterType = Array<{ text: string; value: any; byDefault?: boolean }>;
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'th',
  templateUrl: './omni-th.component.html',
  styleUrls: ['./omni-th.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OmniThComponent implements OnInit, OnChanges {
  public showFilters = false;
  @Input() filterName: string;
  @Input() isSortable = false;
  @Input() sortKey: string;
  @Input() sortDirection: 'asc' | 'dsc' | null = null;
  multipleFilterList: ThItemInterface[] = []; // used in template
  @Input() multipleFilters: ThFilterType = [];

  @Output() readonly sortChange = new EventEmitter<{ key: string; value: string | null }>();
  @Output() readonly filterChange = new EventEmitter<string[]>();
  private sortChangeSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public sortChange$ = this.sortChangeSubject.asObservable();
  constructor() { }

  get filterList(): string[] {
    return this.multipleFilterList.filter(item => item.checked).map(item => item.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.multipleFilters && this.multipleFilters) {
      this.initMultipleFilters();
    }
  }

  ngOnInit(): void {
    this.initMultipleFilters();
  }

  updateSortValue(): void {
    if (!this.isSortable) {
      return;
    }

    if (this.sortDirection === 'asc') {
      this.setSortValue('dsc');
    } else if (this.sortDirection === 'dsc') {
      this.setSortValue(null);
    } else {
      this.setSortValue('asc');
    }
  }

  setSortValue(value: 'asc' | 'dsc' | null): void {
    this.sortDirection = value;
    this.sortChange.emit({ key: this.sortKey, value: this.sortDirection });
    this.sortChangeSubject.next({ key: this.sortKey, value: this.sortDirection });
  }

  setFilterVaues(values: []) {
    values.forEach(value => {
      // tslint:disable-next-line: triple-equals
      const itemToFind = this.multipleFilterList.find(item => item.value == value);
      if (itemToFind) {
        itemToFind.checked = true;
      }
    });
    this.filterChange.emit(this.filterList);
  }

  initMultipleFilters() {
    this.multipleFilterList = this.multipleFilters.map(item => {
      const checked = !!item.byDefault;
      return { text: item.text, value: item.value, checked };
    });
    return this.multipleFilterList;
  }

  checkMultiple(item: ThItemInterface) {
    item.checked = !item.checked;
    this.filterChange.emit(this.filterList);
  }
}
