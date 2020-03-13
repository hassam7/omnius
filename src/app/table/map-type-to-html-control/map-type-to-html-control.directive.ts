import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[omniMapTypeToHtmlControlMapTypeToHtmlControl]'
})
export class MapTypeToHtmlControlDirective implements OnInit {
  @Input('omniMapTypeToHtmlControlMapTypeToHtmlControl') data: any;
  private el: HTMLElement;
  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
  }

}
