import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OmniTableComponent } from './omni-table/omni-table.component';
import { MapTypeToHtmlControlDirective } from './map-type-to-html-control/map-type-to-html-control.directive';
import { OmniThComponent } from './omni-th/omni-th.component';
import { OmniPaginationComponent } from './pagination/pagination.component';
import { FormsModule } from '@angular/forms';

const COMPONENTS = [OmniTableComponent, MapTypeToHtmlControlDirective, OmniThComponent, OmniPaginationComponent];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class TableModule { }
