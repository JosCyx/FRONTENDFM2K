import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  //EJECUTAR METODOS DE PROVEEDORES Y DOCUMENTACION DESDE SOLICITUD DE COTIZACION
  private cotDocumentacion = new Subject<void>();
  private cotProveedores = new Subject<void>();

  cotDocumentacion$ = this.cotDocumentacion.asObservable();
  cotProveedores$ = this.cotProveedores.asObservable();

  cotDocumentacionChange(){
    this.cotDocumentacion.next();
  }

  cotProveedoresChange(){
    this.cotProveedores.next();
  }

  //EJECUTAR METODOS DE DOCUMENTACION DESDE SOLICITUD DE ORDEN DE COMPRA
  private ocDocumentacion = new Subject<void>();

  ocDocumentacion$ = this.ocDocumentacion.asObservable();

  ocDocumentacionChange(){
    this.ocDocumentacion.next();
  }

  //EJECUTAR METODOS DE DOCUMENTACION DESDE SOLICITUD DE PAGO
  private spDocumentacion = new Subject<void>();

  spDocumentacion$ = this.spDocumentacion.asObservable();

  spDocumentacionChange(){
    this.spDocumentacion.next();
  }

  //EJECUTAR METODOS DE DESTINO DESDE SOLICITUD DE PAGO
  private spDestino = new Subject<void>();

  spDestino$ = this.spDestino.asObservable();

  spDestinoChange(){
    this.spDestino.next();
  }
  
  /*
  //EJECUTAR METODOS DE SOLICITUD DE COTIZACION DESDE ANULACION
  private aprobarsubject = new Subject<void>();
  private anularsubject = new Subject<void>();
  private noautorizarsubject = new Subject<void>();

  aprobar$ = this.aprobarsubject.asObservable();
  anular$ = this.anularsubject.asObservable();
  noautorizar$ = this.noautorizarsubject.asObservable();

  aprobar(){
    this.aprobarsubject.next();
  }

  anular(){
    this.anularsubject.next();
  }

  noautorizar(){
    this.noautorizarsubject.next();
  }

  //EJECUTAR METODOS DE SOLICITUD DE ORDEN DE COMPRA DESDE ANULACION
  private aprobarocsubject = new Subject<void>();
  private anularocsubject = new Subject<void>();
  private noautorizarocsubject = new Subject<void>();

  aprobaroc$ = this.aprobarocsubject.asObservable();
  anularoc$ = this.anularocsubject.asObservable();
  noautorizaroc$ = this.noautorizarocsubject.asObservable();

  aprobaroc(){
    this.aprobarocsubject.next();
  }

  anularoc(){
    this.anularocsubject.next();
  }

  noautorizaroc(){
    this.noautorizarocsubject.next();
  }

  //EJECUTAR METODOS DE SOLICITUD DE PAGO DESDE ANULACION
  private aprobarspsubject = new Subject<void>();
  private anularspsubject = new Subject<void>();
  private noautorizarspsubject = new Subject<void>();

  aprobarsp$ = this.aprobarspsubject.asObservable();
  anularsp$ = this.anularspsubject.asObservable();
  noautorizarsp$ = this.noautorizarspsubject.asObservable();

  aprobarsp(){
    this.aprobarspsubject.next();
  }

  anularsp(){
    this.anularspsubject.next();
  }

  noautorizarsp(){
    this.noautorizarspsubject.next();
  }
*/
}
