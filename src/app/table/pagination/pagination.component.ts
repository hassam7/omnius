import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'omni-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class OmniPaginationComponent implements OnInit {
  @Input() pageSizes = [5, 10, 15, 20, 30, 40];

  @Input()
  set selectedPageSize(pageSize) {
    this.selectedPageSizeInternal = pageSize;
  }

  get selectedPageSize(): number {
    return +this.selectedPageSizeInternal;
  }

  @Input() totalItems: number;
  @Input()
  set currentPage(page) {
    if (page < 1) {
      page = 1;
    }
    if (page > this.totalNumberOfPages) {
      page = this.totalNumberOfPages;
    }
    this.currentPageInternal = page;
  }

  get currentPage(): number {
    return this.currentPageInternal;
  }
  private selectedPageSizeInternal: number;
  private currentPageInternal: number;

  get totalNumberOfPages(): number {
    return Math.ceil(this.totalItems / this.selectedPageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.selectedPageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.selectedPageSize, this.totalItems);
  }

  ngOnInit(): void {
    console.log('X', this.startIndex, this.endIndex);
  }

  selectedPageSizeChanged() {
    this.currentPage = Math.min(this.currentPage, this.totalNumberOfPages);
    console.log('Foo', this.startIndex, this.endIndex);
  }

  nextPage() {
    console.log('Next Page');
    this.currentPage++;
    console.log(this.startIndex, this.endIndex);
  }

  previousPage() {
    console.log('Previous Page');
    this.currentPage--;
    console.log(this.startIndex, this.endIndex);
  }
}
