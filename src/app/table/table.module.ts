import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OmniTableComponent } from './omni-table/omni-table.component';
import { MapTypeToHtmlControlDirective } from './map-type-to-html-control/map-type-to-html-control.directive';



@NgModule({
  declarations: [OmniTableComponent, MapTypeToHtmlControlDirective],
  exports: [OmniTableComponent, MapTypeToHtmlControlDirective],
  imports: [
    CommonModule
  ]
})
export class TableModule { }
