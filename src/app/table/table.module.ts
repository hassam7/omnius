import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OmniTableComponent } from './omni-table/omni-table.component';
import { MapTypeToHtmlControlDirective } from './map-type-to-html-control/map-type-to-html-control.directive';
import { OmniThComponent } from './omni-th/omni-th.component';



@NgModule({
  declarations: [OmniTableComponent, MapTypeToHtmlControlDirective, OmniThComponent],
  exports: [OmniTableComponent, MapTypeToHtmlControlDirective, OmniThComponent],
  imports: [
    CommonModule
  ]
})
export class TableModule { }
