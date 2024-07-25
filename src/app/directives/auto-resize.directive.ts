import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: 'textarea[autoResize]'
})
export class AutoResizeDirective {

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.adjustHeight();
    }, 10);
  }

  @HostListener('input')
  onInput(): void {
    this.adjustHeight();
  }

  @HostListener('ngModelChange')
  onNgModelChange(): void {
    this.adjustHeight();
  }

  private adjustHeight(): void {
    const textarea = this.element.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

}
