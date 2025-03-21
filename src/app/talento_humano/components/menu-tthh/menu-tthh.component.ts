import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-menu-tthh',
  templateUrl: './menu-tthh.component.html',
  styleUrls: ['./menu-tthh.component.css']
})
export class MenuTthhComponent {
   userName: string = this.cookieService.get('userName');
    isLogin: boolean = false;
    showSB: boolean = false;
  
    constructor(
      public globalService: GlobalService,
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
