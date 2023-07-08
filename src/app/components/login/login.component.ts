import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router,private globalService: GlobalService) { }

  login():void{
    this.globalService.isLogin = true;
    this.router.navigate(['main']);

  }
}
