import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service'; 
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent {
  userName: string = this.cookieService.get('userName');
  isLogin: boolean = false;
  showSB: boolean = false;

  constructor(private globalService: GlobalService,
    private router: Router, 
    private cookieService: CookieService) { }

  isSidebarVisible = false;

  toggleSidebar() {
    this.showSB = !this.showSB;
  }

  //modificar variable que muestra o no la barra de busqueda
  backToMain():void{
    //this.globalService.toggleAppSelected();
    //this.globalService.appSelected = false;

    this.router.navigate(['main']);
  }

  logOut(){
    this.cookieService.delete('authToken');
    this.cookieService.delete('userLogin');
    this.cookieService.delete('userIdNomina');
    this.cookieService.delete('userName');
    this.router.navigate(['login']);
    //console.log('Token vacio', this.cookieService.get('authToken'))

  }
}
