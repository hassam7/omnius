import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OmniTableComponent } from './omni-table/omni-table.component';



@NgModule({
  declarations: [OmniTableComponent],
  exports: [OmniTableComponent],
  imports: [
    CommonModule
  ]
})
export class TableModule { }
