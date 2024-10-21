import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GlobalEventosService } from 'src/app/services/global-eventos.service';

@Component({
  selector: 'app-menu-evento',
  templateUrl: './menu-evento.component.html',
  styleUrls: ['./menu-evento.component.css']
})
export class MenuEventoComponent {
  userName: string = this.cookieService.get('userName');
  isLogin: boolean = false;
  showSB: boolean = false;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private cookieService: CookieService,
    private globalEvService: GlobalEventosService
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
