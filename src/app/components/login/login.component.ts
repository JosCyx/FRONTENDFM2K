import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loading: boolean = false;
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
    private authService: AuthService,
    private cookieService: CookieService
  ) { }

  get Username(): FormControl {
    return this.loginForm.get("username") as FormControl;
  }

  get Password(): FormControl {
    return this.loginForm.get("password") as FormControl;
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      this.router.navigate(['main']);
    }
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
    

  login(): void {
    this.loading = true;

    if (this.loginForm.valid) {

      //enviar como parametro el valor ingresado en el formulario del usuario y la contraseña
      this.authService.login(this.loginForm.value.username!, this.loginForm.value.password!).subscribe(
        (response: any) => {
          //mensaje de bienvenida
          this.showmsj = true;
          this.msjExito = `Bienvenido(a) ${response.usuario.usNombre}.`;

          //creacion de cookies para almacenar los datos de inicio de sesion con duracion de 12 horas
          const expirationDate = new Date();
          expirationDate.setHours(expirationDate.getHours() + 12);
          this.cookieService.set('authToken', response.token, expirationDate);

          this.cookieService.set('userLogin', response.usuario.usLogin, expirationDate);
          this.cookieService.set('userIdNomina', response.usuario.usIdNomina, expirationDate);
          this.cookieService.set('userArea', response.usuario.usArea, expirationDate);
          this.cookieService.set('userName', response.usuario.usNombre, expirationDate);
          

          //consulta los roles del usuario autenticado y guarda sus transacciones
          this.checkAuthorization();
          this.getNivelRoles();

          

          //limpieza del mensaje
          setTimeout(() => {
            this.showmsj = false;
            this.loading = false;
            this.msjExito = '';
            this.router.navigate(['main']);
            //console.log("Cookies: ", this.cookieService.getAll());
          }, 2000);

        },
        error => {
          if (error.status == 404) {
            //console.log("El usuario no existe.");
            console.log("Error 404:", error)
            this.loading = false;
            this.showmsjerror = true;
            this.msjError = 'El usuario no existe.';

            setTimeout(() => {
              this.showmsjerror = false;
              this.msjError = '';
            }, 3000);
          } else if (error.status == 400) {
            //console.log("La contraseña no coincide.");
            console.log("Error 400:", error)
            this.loading = false;
            this.showmsjerror = true;
            this.msjError = 'La contraseña no coincide.';

            setTimeout(() => {
              this.showmsjerror = false;
              this.msjError = '';
            }, 3000);
          } else {
            console.log("Error:", error);
            this.loading = false;
            this.showmsjerror = true;
            this.msjError = 'Error, intente nuevamente.';

            setTimeout(() => {
              this.showmsjerror = false;
              this.msjError = '';
            }, 3000);
          }
        } 
      );
    } else {
      console.log("Login invalido");
    }

  }

  //consulta a la base los roles asociados al usuario autenticado
  checkAuthorization() {

    //consultar roles del usuario autenticado
    this.authService.getAuthorization(this.cookieService.get('userLogin')).subscribe(
      response => { 
        this.cookieService.set('userTransactions', response.toString());
      },
      error => {
        console.log(error);
      }
    );
  }

  //consulta los niveles de las solicitudes a los que tendra acceso el usuario autenticado
  getNivelRoles(){
    this.authService.getRolNiveles(this.cookieService.get('userLogin')).subscribe(
      response => { 
        this.cookieService.set('userRolNiveles', response.toString());
      },
      error => {
        console.log(error);
      }
    );
  }
}
