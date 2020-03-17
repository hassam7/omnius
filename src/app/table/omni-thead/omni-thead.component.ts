import { merge, Subject, combineLatest } from 'rxjs';
import { takeUntil, filter, tap, map, startWith, } from 'rxjs/operators';
import { Component, ContentChildren, QueryList, AfterContentInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { OmniThComponent } from '../omni-th/omni-th.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'thead',
  templateUrl: './omni-thead.component.html',
  styleUrls: ['./omni-thead.component.scss']
})
export class OmniTheadComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(OmniThComponent, { descendants: true }) thList: QueryList<OmniThComponent>;
  @Output() sortChange = new EventEmitter<Array<{ key: string; value: string | null }>>();
  private destroy$ = new Subject<void>();

  ngAfterContentInit() {
    this.initSortingStream();
    this.initFilteringStream();
  }


  initFilteringStream() {
    combineLatest(
      [...this.thList
        .filter(th => th.shouldShowFilter)
      ]
        .map(
          th => th.filterChange.pipe(
            startWith(null),
            map(selectedItemArray => {
              return selectedItemArray ? { name: th.filterName, filter: selectedItemArray } : null;
            })
          )
        )
    )
      .subscribe(x => console.log(x))
  }

  initSortingStream() {
    combineLatest([...this.thList.filter(o => o.isSortable)
      .map(o => o.sortChange$)])
      .pipe(
        map(array => array.filter(item => !!item)),
        filter(array => array.length !== 0),
        takeUntil(this.destroy$),
      )
      .subscribe((data) => {
        this.sortChange.emit(data);
      });
  }

  updateThSortingStatus(sortConfig: Array<{ key: string; value: string }>) {
    const thToUpdate = this.thList
      .filter(th => !!th.sortKey)
      .reduce((acc, currentValue) => {
        acc[currentValue.sortKey] = currentValue;
        return acc;
      }, {});
    sortConfig.forEach(k => {
      const thItem: OmniThComponent = thToUpdate[k.key];
      thItem.setSortValue(k.value as 'asc' | 'dsc');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
