import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) { }
  

  canActivate(): boolean {    

    if (this.authService.isAuthenticated()) {
      console.log("se va a la ruta indicada");
      return true; // El usuario está autenticado y puede acceder a la ruta
    } else {
      // El usuario no está autenticado, redirigir a la página de inicio de sesión
      this.router.navigate(['login']);
      console.log("se mantiene en login");
      return false;
    }
  }
}

