import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'omni-table',
  templateUrl: './omni-table.component.html',
  styleUrls: ['./omni-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OmniTableComponent implements OnInit, OnChanges {
  data: {[key: string]: any};
  @Input() tableData: {[key: string]: any};
  @Input() shouldShowPagination = true;
  constructor() { }

  ngOnInit(): void {
    this.data = this.tableData;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = this.tableData;
  }

}
