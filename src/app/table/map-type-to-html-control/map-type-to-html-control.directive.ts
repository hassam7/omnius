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
    this.mapDataToType(this.data);
  }

  private mapDataToType(data: any) {
    if (typeof data === 'string') {
      this.el.innerText = data;
    } else if(typeof data === 'boolean') {
      const isChecked = !!data;
      this.el.innerHTML = `<input type="checkbox" ${isChecked ? 'checked' : '' }>`;
    }
  }

}
