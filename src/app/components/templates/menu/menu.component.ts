import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service'; 
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  appSelected: boolean = this.globalService.appSelected;
  isLogin: boolean = false;
  showSB: boolean = false;

  constructor(private globalService: GlobalService,private router: Router, private cookieService: CookieService) { }

  isSidebarVisible = false;

  toggleSidebar() {
    this.showSB = !this.showSB;
    //this.isSidebarVisible = !this.isSidebarVisible;
  }

  backToMain():void{
    //this.globalService.toggleAppSelected();
    //this.globalService.appSelected = false;

    this.router.navigate(['main']);
  }

  //destruye la cookie
  logOut(){
    this.cookieService.delete('authToken');
    this.router.navigate(['login']);
    //console.log('Token vacio', this.cookieService.get('authToken'))

  }

}
