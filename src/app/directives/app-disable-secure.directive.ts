import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appAppDisableSecure]'
})
export class AppDisableSecureDirective implements OnInit{

  @Input('appSecureDisable') transaction!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    const hasAccess = this.checkAccess(this.transaction);

    if (!hasAccess) {
      // Deshabilita las interacciones en el elemento.
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
      // Puedes aplicar estilos adicionales para indicar que está deshabilitado si es necesario.
      // this.renderer.addClass(this.el.nativeElement, 'disabled-style');
    }
  }

  checkAccess(transaction: string): boolean {
    return false;
  }

}
