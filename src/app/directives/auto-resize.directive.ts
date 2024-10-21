import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NgModel } from '@angular/forms';
import { GlobalEventosService } from '../services/global-eventos.service';

@Directive({
  selector: 'textarea[autoResize]'
})
export class AutoResizeDirective {

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.adjustHeight();
    }, 20);
  }

  @HostListener('input')
  onInput(): void {
    this.adjustHeight();
  }

  @HostListener('ngModelChange')
  onNgModelChange(): void {
    this.adjustHeight();
  }

  adjustHeight(): void {
    console.log('adjustHeight Directive');
    const textarea = this.element.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

}
