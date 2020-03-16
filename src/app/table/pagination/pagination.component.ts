import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'omni-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class OmniPaginationComponent {
  @Input() pageSizes = [5, 10, 25, 50, 100];

  @Input()
  set selectedPageSize(pageSize) {
    if (pageSize) {
      this.selectedPageSizeInternal = pageSize;
    }
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
  @Output() pageSizeChanged = new EventEmitter();
  private selectedPageSizeInternal = 25;
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

  selectedPageSizeChanged(pageSize: string) {
    this.currentPage = Math.min(this.currentPage, this.totalNumberOfPages);
    this.pageSizeChanged.emit(+pageSize);
  }

  nextPage() {
    this.currentPage++;
    // console.log(this.startIndex, this.endIndex);
  }

  previousPage() {
    this.currentPage--;
    // console.log(this.startIndex, this.endIndex);
  }
}
