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
  sol: boolean = false;
  admin: boolean = false;
  isLogin: boolean = false;

  constructor(private globalService: GlobalService,private router: Router) { }

  ngOnInit():void{
    this.appSelected  = this.globalService.appSelected;
    this.sol = this.globalService.sol;
    this.admin = this.globalService.admin;
    this.isLogin = this.globalService.isLogin;
  }

  backToMain():void{
    this.globalService.sol = false;
    this.globalService.admin = false;
    this.globalService.appSelected = false;

    this.router.navigate(['main']);
  }
}
