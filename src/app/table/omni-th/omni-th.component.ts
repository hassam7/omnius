import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'th',
  templateUrl: './omni-th.component.html',
  styleUrls: ['./omni-th.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OmniThComponent implements OnInit {
  @Input() isSortable = false;
  @Input() sortKey: string;
  @Input() sortDirection: 'asc' | 'dsc' | null = null;
  @Output() readonly sortChange = new EventEmitter<{ key: string; value: string | null }>();
  constructor() { }

  ngOnInit(): void {
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
  }

}
