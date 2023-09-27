import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/authentication/auth.service';


@Directive({
  selector: '[appAppAuthorizeTransaction]'
})
export class AppAuthorizeTransactionDirective implements OnInit{

  @Input() set appAuthorizeTransaction(transaction: string) {
    this.transaction = transaction;
  }

  private transaction!: string;

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {
    // Verifica si el usuario tiene acceso a la transacción.
    const hasAccess = this.authService.checkAccess(this.transaction);
    
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
