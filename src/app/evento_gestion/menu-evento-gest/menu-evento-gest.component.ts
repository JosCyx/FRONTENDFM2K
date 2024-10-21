import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-menu-evento-gest',
  templateUrl: './menu-evento-gest.component.html',
  styleUrls: ['./menu-evento-gest.component.css']
})
export class MenuEventoGestComponent {
  userName: string = this.cookieService.get('userName');
  isLogin: boolean = false;
  showSB: boolean = false;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  isSidebarVisible = false;

  toggleSidebar() {
    this.showSB = !this.showSB;
  }

  logOut() {
    // Aquí puedes personalizar según tus necesidades de logout
    this.cookieService.delete('authToken');
    this.cookieService.delete('userLogin');
    this.cookieService.delete('userIdEvento');
    this.cookieService.delete('userName');
    this.router.navigate(['login']);
  }
}
