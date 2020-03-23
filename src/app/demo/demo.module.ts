import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './demo-routing.module';
import { DemoComponent } from './demo.component';
import { TableModule } from '../table/table.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [DemoComponent],
  imports: [
    CommonModule,
    TestRoutingModule,
    TableModule,
    FormsModule,
  ]
})
export class TestModule { }
