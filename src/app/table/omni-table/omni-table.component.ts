import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'omni-table',
  templateUrl: './omni-table.component.html',
  styleUrls: ['./omni-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OmniTableComponent implements OnInit, OnChanges {
  data: {[key: string]: any};
  @Input() tableData: {[key: string]: any};
  @Input() shouldShowPagination = false;
  get queryParams() {
    return {};
  }
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.data = this.tableData;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = this.tableData;
  }

  public updateQueryParams() {
    this.router.navigate([this.router.url], { queryParams: this.queryParams, replaceUrl: true });
  }
}
