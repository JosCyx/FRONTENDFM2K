import { Directive, Input, Renderer2, ElementRef, OnInit, SimpleChanges, OnChanges  } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FichaEventoService } from '../services/comunicationAPI/eventos/ficha-evento.service';
import { GlobalEventosService } from '../services/global-eventos.service';


@Directive({
  selector: '[appEvDisable]'
})
export class AppEvDisableDirective implements OnChanges {

  @Input('appEvDisable') estadoFicha!: number;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private cookieService: CookieService,
    private fichaEvService: FichaEventoService,
    private globalEvService: GlobalEventosService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estadoFicha'] && this.estadoFicha && this.globalEvService.editMode) {
      this.applyDisableLogic(this.estadoFicha);
    }
  }

  private applyDisableLogic(nivel: number): void {
    if (nivel === 3) {
      this.disableElement();
    } else {
      this.fichaEvService.getLevelEnabled(this.cookieService.get('userIdNomina')).subscribe(
        (data) => {
          if (data === nivel) {
            this.enableElement();
          } else {
            this.disableElement();
          }
        }
      );
    }
  }

  private disableElement(): void {
    this.renderer.setAttribute(this.element.nativeElement, 'disabled', 'true');
  }

  private enableElement(): void {
    this.renderer.removeAttribute(this.element.nativeElement, 'disabled');
    
  }
}
