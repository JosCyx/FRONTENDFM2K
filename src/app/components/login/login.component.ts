import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { CookieService } from 'ngx-cookie-service';


/*interface userResponse {
  usEmpresa: number;
  usId: number;
  usLogin: string;
  usContrasenia: string;
  usNombre: string;
  usEstado: string;
  usFechaInicio: string;
  usFechaCaduca: string;
  usServicioC: any; // Puedes especificar el tipo adecuado aquí si lo conoces
  usUserData: any; // Puedes especificar el tipo adecuado aquí si lo conoces
  usBanUserData: any; // Puedes especificar el tipo adecuado aquí si lo conoces
  usTipoAcceso: any; // Puedes especificar el tipo adecuado aquí si lo conoces
  audEvento: any; // Puedes especificar el tipo adecuado aquí si lo conoces
  audFecha: any; // Puedes especificar el tipo adecuado aquí si lo conoces
  audUsuario: any; // Puedes especificar el tipo adecuado aquí si lo conoces
  audObservacion: any; // Puedes especificar el tipo adecuado aquí si lo conoces
  audVeces: any; // Puedes especificar el tipo adecuado aquí si lo conoces
}*/


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showmsj: boolean = false;
  //msjExito: string = 'Bienvenido Administrador.'
  msjExito!: string;
  showmsjerror: boolean = false;
  msjError!: string;


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
    private authService: AuthService,
    private cookieService: CookieService
  ) { }

  get Username(): FormControl {
    return this.loginForm.get("username") as FormControl;
  }

  get Password(): FormControl {
    return this.loginForm.get("password") as FormControl;
  }


  login(): void {
    if (this.loginForm.valid) {

      //enviar como parametro el valor ingresado en el formulario del usuario y la contraseña
      this.authService.login(this.loginForm.value.username!, this.loginForm.value.password!).subscribe(
        (response: any) => {
          //this.authService.userLogin = response.usuario.usLogin;
          //this.authService.userIdNomina = response.usuario.usIdNomina;
          //this.checkAuthorization();
          console.log(response);

          //redirigir a la siguiente pagina si el login es correcto
          this.showmsj = true;
          this.msjExito = `Bienvenido(a) ${response.usuario.usNombre}.`;

          //creacion de una cookie para almacenar el token de autenticacion que durará 12 horas
          const expirationDate = new Date();
          expirationDate.setHours(expirationDate.getHours() + 12);
          this.cookieService.set('authToken', response.token, expirationDate);

          //imprimir token del usuario
          //console.log(this.cookieService.get('authToken'));

          //limpieza del mensaje
          setTimeout(() => {
            this.showmsj = false;
            this.msjExito = '';
            this.globalService.isLogin = true;
            this.router.navigate(['main']);
          }, 2000);

        },
        error => {
          /*if (error.status == 404) {
            //console.log("El usuario no existe.");
            console.log("Error 404:", error)
            this.showmsjerror = true;
            this.msjError = 'El usuario no existe.';

            setTimeout(() => {
              this.showmsjerror = false;
              this.msjError = '';
            }, 3000);
          } else if (error.status == 400) {
            //console.log("La contraseña no coincide.");
            console.log("Error 400:", error)
            this.showmsjerror = true;
            this.msjError = 'La contraseña no coincide.';

            setTimeout(() => {
              this.showmsjerror = false;
              this.msjError = '';
            }, 3000);
          }*/
          console.log("Error:", error)
        }
      );
    } else {
      console.log("Login invalido");
    }

  }

  checkAuthorization() {

  }
}
