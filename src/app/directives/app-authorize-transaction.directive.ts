import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Directive({
  selector: '[appAuthorize]'
})
export class AppAuthorizeTransactionDirective implements OnInit{
  private transaction!: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private cookieService: CookieService
  ) { }

 @Input('appAuthorize') set appAuthorizeTransaction(transaction: string) {
    this.transaction = transaction;

    // Verifica si el usuario tiene acceso a la transacción.
    const hasAccess = this.checkAccess(this.transaction);
    //console.log("Acceso:", hasAccess);
    //console.log(this.cookieService.get('userTransactions'));
    
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  ngOnInit() {
    
  }

  //verifica si el numero de transacion ingresado existe en la cookie de transacciones del usuario
  checkAccess(transaction: string): boolean {
    const userTransactionsCookie = this.cookieService.get('userTransactions');
    if (userTransactionsCookie) {
      const userTransactionsArray = userTransactionsCookie.split(',').map(Number);
      return userTransactionsArray.includes(Number(transaction));
    }
    return false;
  }

}
