import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { AppAuthorizeTransactionDirective } from 'src/app/directives/app-authorize-transaction.directive';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userName: string = this.cookieService.get('userName');

  constructor(private globalService: GlobalService,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService) { }

  ngOnInit(): void {
  }

  logOut() {
    this.cookieService.delete('authToken');
    this.cookieService.delete('userLogin');
    this.cookieService.delete('userIdNomina');
    this.cookieService.delete('userName');
    this.router.navigate(['login']);
    //console.log('Token vacio', this.cookieService.get('authToken'))

  }
  goRequests(): void {
    this.router.navigate(['mainconfig']);
  }

  goAdmin(): void {
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

  //lista de numeros del 1 al 5
  numeros: string[] = ['1', '2', '3', '4', '5'];
  metodo(num: string){
    //metodo que verifique si el numero ingresado existe en la lista
    console.log(this.numeros.includes(num));
  }
}
