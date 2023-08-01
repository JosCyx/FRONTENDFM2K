import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  appSelected: boolean = false;
  isLogin: boolean = false;
  showSB: boolean = false;

  constructor(private globalService: GlobalService,private router: Router) { }

  isSidebarVisible = false;

  toggleSidebar() {
    this.showSB = !this.showSB;
    //this.isSidebarVisible = !this.isSidebarVisible;
  }

  ngOnInit():void{
    this.appSelected  = this.globalService.appSelected;
    this.isLogin = this.globalService.isLogin;
  }

  backToMain():void{
    this.globalService.appSelected = false;

    this.router.navigate(['main']);
  }

  logOut(){
    this.globalService.isLogin = false;
    this.router.navigate(['login']);

  }
}
