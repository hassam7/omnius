import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ContentChild,
  AfterContentInit,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OmniTheadComponent } from '../omni-thead/omni-thead.component';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'omni-table',
  templateUrl: './omni-table.component.html',
  styleUrls: ['./omni-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OmniTableComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy {
  data: { [key: string]: any };
  @Input() tableData: { [key: string]: any };
  @Input() shouldShowPagination = false;
  @Input() totalItems = 71;
  @Input() shouldShowSearch = true;
  @ContentChild(OmniTheadComponent) thead: OmniTheadComponent;
  public searchTerm;
  public currentPageSizeAction: BehaviorSubject<number | null>;
  private sortFilters: BehaviorSubject<Array<{ key: string; value: string | null }> | []>;
  private theadReady: Subject<void> = new Subject();
  private customParams;
  get params() {
    const params: any = {};
    if (this.currentPageSizeAction.value) {
      params.pageSize = this.currentPageSizeAction.value;
    }

    const sortFilters = this.sortFilters.value;
    if (sortFilters.length) {
      const filterToChange = sortFilters.filter(item => !!item.value);
      if (filterToChange.length) {
        const keys = filterToChange.map(d => d.key);
        const values = filterToChange.map(d => d.value);
        params.sortKeys = keys;
        params.sortValues = values;
      } else {
        delete params.sortKeys;
        delete params.sortValues;
      }
    }
    if (this.searchTerm?.trim().length) {
      params.searchTerm = this.searchTerm;
    }
    if (this.customParams) {
      params.customParams = this.customParams;
    }
    return params;
  }

  private destroy$ = new Subject<void>();

  constructor(private router: Router, route: ActivatedRoute) {
    this.initFilterStreams();
    this.subscribeParamsStream();
    route.params.subscribe(this.setParamsToControl.bind(this));
  }

  ngOnInit(): void {
    this.data = this.tableData;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = this.tableData;
  }

  ngAfterContentInit() {
    this.thead.sortChange.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.sortFilters.next(data);
    });
    this.theadReady.next();
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchTermChange(searchTerm) {
    this.searchTerm = searchTerm;
    this.updateQueryParams();
  }

  onPageSizeChange(pageSize: number) {
    this.currentPageSizeAction.next(pageSize);
  }

  addToUrlState(data) {
    this.customParams = data;
    this.updateQueryParams();
  }

  private setParamsToControl(params) {
    if (params.pageSize) {
      this.currentPageSizeAction.next(params.pageSize);
    }
    if (params.sortKeys && params.sortValues) {

      let sortValues = params.sortValues;
      let sortKeys = params.sortKeys;
      if (typeof sortKeys === 'string') {
        sortKeys = sortKeys.split(',');
      }
      if (typeof sortValues === 'string') {
        sortValues = sortValues.split(',');
      }
      if (sortKeys.length === sortValues.length) {
        const sortConfig = sortKeys.map((key: string, index: number) => ({ key, value: sortValues[index] }));
        this.theadReady.pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.thead.updateThSortingStatus(sortConfig);
        });
      }
    }

    if (params?.searchTerm?.trim()?.length) {
      this.searchTerm = params.searchTerm;
    }
  }

  private updateQueryParams() {
    this.router.navigate(['.', this.params]);
  }

  private initFilterStreams() {
    this.currentPageSizeAction = new BehaviorSubject(null);
    this.sortFilters = new BehaviorSubject([]);
  }

  private subscribeParamsStream() {
    combineLatest([this.currentPageSizeAction, this.sortFilters])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateQueryParams();
      });
  }
}
