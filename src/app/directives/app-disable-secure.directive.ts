import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';
import { set } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';

@Directive({
  selector: '[appSecureDisable]'
})
export class AppDisableSecureDirective implements OnInit {
  //private nivel!: string;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private cookieService: CookieService
  ) { }

  @Input('appSecureDisable') set AppDisableSecureDirective(nivel: string) {
    setTimeout(() => {
      const hasAccess = this.checkAccess(nivel);

      if (!hasAccess) {
        //console.log('Deshabilitado: ', hasAccess);
        //deshabilita el input al que esté asignado esta directiva
        this.renderer.setAttribute(this.element.nativeElement, 'disabled', 'true');
      } else {
        //console.log('Habilitado: ', hasAccess);
        //habilita el input al que esté asignado esta directiva
        this.renderer.removeAttribute(this.element.nativeElement, 'disabled');
      }
    }, 400);

  }

  ngOnInit(): void {

  }
  // private nivel!: string;

  // ngOnInit() {
  //   setTimeout(() => {
  //     const hasAccess = this.checkAccess(this.nivel);

  //     if (!hasAccess) {
  //       console.log('Deshabilitado: ', hasAccess);
  //       //deshabilita el input al que esté asignado esta directiva
  //       this.renderer.setAttribute(this.element.nativeElement, 'disabled', 'true');
  //     } else {
  //       console.log('Habilitado: ', hasAccess);
  //       //habilita el input al que esté asignado esta directiva
  //       this.renderer.removeAttribute(this.element.nativeElement, 'disabled');
  //     }
  //   }, 400);
  // }

  checkAccess(nivel: string): boolean {
    //console.log('nivel', nivel);
    const userNivelesCookie = this.cookieService.get('userRolNiveles');
    if (userNivelesCookie) {
      const userNivelesArray = userNivelesCookie.split(',').map(Number);
      return userNivelesArray.includes(Number(nivel));
    }
    return false;
  }

}
