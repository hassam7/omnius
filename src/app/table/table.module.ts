import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OmniTableComponent } from './omni-table/omni-table.component';
import { MapTypeToHtmlControlDirective } from './map-type-to-html-control/map-type-to-html-control.directive';
import { OmniThComponent } from './omni-th/omni-th.component';
import { OmniPaginationComponent } from './pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { OmniTheadComponent } from './omni-thead/omni-thead.component';
import { OmniSearchComponent } from './omni-search/omni-search.component';

const COMPONENTS = [
  OmniTableComponent,
  MapTypeToHtmlControlDirective,
  OmniThComponent,
  OmniPaginationComponent,
  OmniTheadComponent,
  OmniSearchComponent
];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [CommonModule, FormsModule]
})
export class TableModule {}
