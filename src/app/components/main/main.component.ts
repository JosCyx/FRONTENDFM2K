import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{
  constructor(private globalService: GlobalService,
    private router: Router,
    private cookieService: CookieService) { }

  ngOnInit():void{
  }

  logOut(){
    this.cookieService.delete('authToken');
    this.router.navigate(['login']);
    //console.log('Token vacio', this.cookieService.get('authToken'))

  }
  goRequests():void{
    this.globalService.appSelected = true;
    this.router.navigate(['mainconfig']);
  }

  goAdmin():void{
    this.globalService.appSelected = true;
    this.router.navigate(['mainsec']);
  }

  clearCookies() {
    const cookies = this.cookieService.getAll();
    
    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        this.cookieService.delete(cookieName);
      }
    }
    console.log(cookies);
  }
}
