import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input('appHighlight') color = '#eafaf1';

  constructor(private host: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter(): void {
    this.host.nativeElement.style.backgroundColor = this.color;
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.host.nativeElement.style.backgroundColor = '';
  }
}
