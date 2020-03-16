import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'omni-search',
  templateUrl: './omni-search.component.html',
  styleUrls: ['./omni-search.component.scss']
})
export class OmniSearchComponent implements OnInit {
  @Input() searchTerm;
  @Output() searchTermChange: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

}
