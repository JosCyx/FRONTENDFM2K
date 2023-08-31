import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';

interface useResponse {
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
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user!: string;
  pass!: string;
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
    if (this.loginForm.valid) {

      //enviar como parametro el valor ingresado en el formulario del usuario y la contraseña
      /*this.authService.login(this.loginForm.value.username!, this.loginForm.value.password!).subscribe(
        (response: useResponse) => {
          //redirigir a la siguiente pagina si el login es correcto
          console.log("Exito, datos de usuario: ", response.usNombre)
          this.globalService.isLogin = true;
          this.router.navigate(['main']);

          nombres: any;
            apellidos: any;
            identificacion: any;
            rol: any;
            area: any;
            dpto: any;
            correo: any;


            //CORREGIR LOS DATOS QUE SE VA A RECIBIR DEL USUARIO

          //guardar los datos del usuario en el arreglo de authService, accediendo a cada propiedad de la respuesta: this.authService.userData.rol = res.usRol
          this.authService.userData.nombres = response.usNombre;
          this.authService.userData.apellidos = response.us
        },
        error => {
          if (error.status == 404) {
            console.log("El usuario no existe.");
          } else if (error.status == 400) {
            console.log("La contraseña no coincide.");
          }
          console.log("Error:", error)
        }
      );*/
    } else {
      console.log("Login invalido");
    }

  }
}
