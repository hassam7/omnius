import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { OmniTableComponent } from '../table/omni-table/omni-table.component';

import data from '../../assets/data.json';
import config from '../../assets/table.config.json';
@Component({
  selector: 'omni-test',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
  editId: string | null;
  @ViewChild('inputField', { static: false, read: ElementRef }) inputElement: ElementRef;
  @ViewChild(OmniTableComponent, { static: false }) omniTable: OmniTableComponent;
  public readonly listOfData = data; // data retrieved from server
  public listOfDisplayData = [...this.listOfData];

  public shouldShowSearch = config.shouldShowSearch;
  public shouldShowPagination = config.shouldShowPagination;

  ageFilter = [
    { text: 32, value: 32 },
    { text: 33, value: 33 }
  ];
  nameFilter = [
    { text: 'Bonnie Wynn', value: 'Bonnie Wynn' },
    { text: 'Colette Ratliff', value: 'Colette Ratliff' }
  ];
  constructor(private router: Router) { }

  @HostListener('window:click', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.editId && this.inputElement && this.inputElement.nativeElement !== e.target) {
      this.editId = null;
    }
  }

  startEdit(id: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = id;
  }

  updateTextToUrl(data) {
    const { key, name } = data;
    this.omniTable.addToUrlState(`${key};${name}`);
  }

  onSearchChange(term) {
    console.log('Search Term Change');
  }

  onAgeFilterChange(items: number[]) {
    setTimeout(() => {
      this.listOfDisplayData = this.listOfData.filter(item => items.includes(item.age));
      this.listOfDisplayData = this.listOfDisplayData.length ? this.listOfDisplayData : this.listOfData;
    });
  }

  sortByName(event: { key: string; value: string | null }): void {
    const sortField = event.key;
    const sortDirection = event.value;
    const dataCopy = [...this.listOfData];
    if (sortDirection) {
      this.listOfDisplayData = dataCopy.sort((a, b) => {
        if (sortDirection === 'asc') return a[sortField].localeCompare(b[sortField]);
        else if (sortDirection === 'dsc') return b[sortField].localeCompare(a[sortField]);
      });
    }
  }

  onSortChange(event: { key: string; value: string | null }): void {
    const sortField = event.key;
    const sortDirection = event.value;
    const dataCopy = [...this.listOfData];
    if (sortDirection) {
      this.listOfDisplayData = dataCopy.sort((a, b) => {
        if (sortDirection === 'asc') {
          return a[sortField] > b[sortField] ? 1 : -1;
        } else if (sortDirection === 'dsc') {
          return b[sortField] > a[sortField] ? 1 : -1;
        }
      });
    } else {
      this.listOfDisplayData = [...this.listOfData];
    }
  }
}
