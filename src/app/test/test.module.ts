import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from '../test/test.component';
import { TableModule } from '../table/table.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TestComponent],
  imports: [
    CommonModule,
    TestRoutingModule,
    TableModule,
    FormsModule,
  ]
})
export class TestModule { }
