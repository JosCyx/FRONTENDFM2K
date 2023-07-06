import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentosComponent } from './components/configuracion/documentos/documentos.component';
import { AplicacionesComponent } from './components/configuracion/seguridad/aplicaciones/aplicaciones.component';
import { FuncionesComponent } from './components/configuracion/seguridad/funciones/funciones.component';
import { TransaccionesComponent } from './components/configuracion/seguridad/transacciones/transacciones.component';
import { UsuariosComponent } from './components/configuracion/seguridad/usuarios/usuarios.component';
import { RolesComponent } from './components/configuracion/seguridad/roles/roles.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path:'login', component: LoginComponent},
  {path:'main', component: MainComponent},
  {path:'documentos', component: DocumentosComponent},
  {path: 'apps', component: AplicacionesComponent},
  {path: 'functions', component: FuncionesComponent},
  {path: 'transact', component: TransaccionesComponent},
  {path: 'users', component: UsuariosComponent},
  {path: 'rol', component: RolesComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
