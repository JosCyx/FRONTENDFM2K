import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appReload]',
})
export class ReloadDirective {
  constructor(private router: Router) {}

  @HostListener('click')
  onClick() {
    const currentRoute = this.router.url;
    this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]);
    });
  }
}
