import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  some!: string;

  loginForm = new FormGroup({
    username: new FormControl("", [
      Validators.required, 
      Validators.minLength(5)
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(5)
    ])
  });

  constructor(
    private router: Router, 
    private globalService: GlobalService, 
    private authService: AuthService
  ) { }

  get Username(): FormControl {
    return this.loginForm.get("username") as FormControl;
  }

  get Password(): FormControl {
    return this.loginForm.get("password") as FormControl;
  }

  login(): void {
    if(this.loginForm.valid){

      //enviar como parametro el valor ingresado en el formulario del usuario y la contraseña
      this.authService.login(this.some,this.some).subscribe(
        res => {
          this.globalService.isLogin = true;
          this.router.navigate(['main']);

          //guardar los datos del usuario en el arreglo de authService, accediendo a cada propiedad de la respuesta: this.authService.userData.rol = res.usRol
        },
        error => {

        }
      );

      this.globalService.isLogin = true;
      this.router.navigate(['main']);
    }else{
      console.log("Login invalido");
    }
    
  }
}
