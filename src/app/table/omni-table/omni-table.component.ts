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
  ContentChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OmniTheadComponent } from '../omni-thead/omni-thead.component';
import { takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject, combineLatest, merge } from 'rxjs';
import { OmniThComponent } from '../omni-th/omni-th.component';
import { PARAM_CODEC } from '../utils/util';
import { HttpParams } from '@angular/common/http';
interface IParams {
  pageSize: number;
  sortKeys: [];
  sortValues: [];
  filterParams: any;
  searchTerm: string;
}
@Component({
  selector: 'omni-table',
  templateUrl: './omni-table.component.html',
  styleUrls: ['./omni-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OmniTableComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy {
  data: { [key: string]: any };
  @Input() tableData: { [key: string]: any };
  @Input() shouldShowPagination = false;
  @Input() totalItems = 71;
  @Input() shouldShowSearch = true;
  @ContentChild(OmniTheadComponent) thead: OmniTheadComponent;
  @ContentChildren(OmniThComponent, { descendants: true }) listOfThComponents: QueryList<OmniThComponent>;
  public searchTerm: string;
  public currentPageSizeAction: BehaviorSubject<number | null>;
  private sortFilters: BehaviorSubject<Array<{ key: string; value: string | null }> | []>;
  private filter: BehaviorSubject<Array<any> | []>;
  private theadReady: Subject<void> = new Subject();
  private customParams;
  get params(): IParams {
    const params: any = {};
    if (this.currentPageSizeAction.value) params.pageSize = this.currentPageSizeAction.value;

    const sortFilters = this.sortFilters.value;
    if (sortFilters.length) {
      const filterToChange = sortFilters.filter(item => !!(item as any).value);
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

    const currentFilter = this.filter.value;

    if (currentFilter.length > 0) params.filterParams = window.encodeURI(JSON.stringify(currentFilter));

    // if (this.searchTerm?.trim().length) { // stack blitz demo fails because of this
    if (this.searchTerm && this.searchTerm.trim().length) {
      // stack blitz demo fails because of this
      params.searchTerm = this.searchTerm;
    }
    if (this.customParams) params.customParams = this.customParams;
    return params;
  }

  private destroy$ = new Subject<void>();

  constructor(private router: Router, private route: ActivatedRoute, private el: ElementRef) {
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
    console.log('content inited');
    this.thead.sortChange.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.sortFilters.next(data);
    });

    this.thead.filterChange.pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log(data);
      this.filter.next(data);
    });

    merge(...this.listOfThComponents.map(th => th.columnVisibilityChange))
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ shouldHide, el }) => {
        const index = Array.from(this.el.nativeElement.querySelectorAll('th')).findIndex(item => item === el);
        const rows = Array.from((this.el.nativeElement.querySelector('table') as HTMLTableElement).rows);
        rows.forEach(row => (row.cells[index].style.display = `${shouldHide ? 'none' : 'table-cell'}`));
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

    if (params.filterParams) {
      const paramData = JSON.parse(window.decodeURI(params.filterParams));
      this.theadReady.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.thead.updateFilters(paramData);
      });
    }

    if (params?.searchTerm?.trim()?.length) {
      this.searchTerm = params.searchTerm;
    }
  }

  private updateQueryParams() {
    this.router.navigate(['.', this.params]);
    console.log(this.generateUrLFromParams());
  }

  private initFilterStreams() {
    this.currentPageSizeAction = new BehaviorSubject(null);
    this.sortFilters = new BehaviorSubject([]);
    this.filter = new BehaviorSubject([]);
  }

  private subscribeParamsStream() {
    combineLatest([this.currentPageSizeAction, this.sortFilters, this.filter])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateQueryParams();
      });
  }

  private generateUrLFromParams() {
    let paramsMap = new HttpParams({ encoder: PARAM_CODEC });
    if (this.params.pageSize) paramsMap = paramsMap.set('pageSize', `${this.params.pageSize}`);
    if (this.params.searchTerm) paramsMap = paramsMap.set('searchTerm', this.params.searchTerm);
    if (this.params.sortKeys && this.params.sortValues) {
      const sortParams = JSON.stringify(
        this.params.sortKeys.map((key: string, index: number) => ({ [key]: this.params.sortValues[index] }))
      );
      paramsMap = paramsMap.set('sort', sortParams);
    }

    if (this.params.filterParams) {
      const filterParams = JSON.parse(decodeURI(this.params.filterParams));
      const filterParamsMapped = filterParams.map((key: { name: string; filter: any[] }) => ({ [key.name]: key.filter }));
      paramsMap = paramsMap.set('filter', JSON.stringify(filterParamsMapped));
    }
    return paramsMap;
  }
}
