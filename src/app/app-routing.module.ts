import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentosComponent } from './components/configuracion/documentos/documentos.component';
import { AplicacionesComponent } from './components/seguridad/aplicaciones/aplicaciones.component';
import { FuncionesComponent } from './components/seguridad/funciones/funciones.component';
import { TransaccionesComponent } from './components/seguridad/transacciones/transacciones.component';
import { UsuariosComponent } from './components/seguridad/usuarios/usuarios.component';
import { RolesComponent } from './components/seguridad/roles/roles.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { RuteoComponent } from './components/configuracion/ruteo/ruteo.component';
import { SolicotiComponent } from './components/procesos/solicoti/solicoti.component';
import { SoliocComponent } from './components/procesos/solioc/solioc.component';
import { SolipagoComponent } from './components/procesos/solipago/solipago.component';
import { MainConfiguracionComponent } from './components/configuracion/main-configuracion.component';
import { MainSeguridadComponent } from './components/seguridad/main-seguridad.component';
import { EmpleadosComponent } from './components/configuracion/empleados/empleados.component';
import { AllrequestComponent } from './components/procesos/allrequest/allrequest.component';
import { AuthGuard } from './auth.guard'; // Importa la guardia de rutas
import { SolicitudesAprobadasComponent } from './components/procesos/solicitudes-aprobadas/solicitudes-aprobadas.component';
import { SolicitudesNoAprobadasComponent } from './components/procesos/solicitudes-no-aprobadas/solicitudes-no-aprobadas.component';
import { RolesTransacComponent } from './components/seguridad/roles-transac/roles-transac.component';
import { RolesUsersComponent } from './components/seguridad/roles-users/roles-users.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path:'login', component: LoginComponent},
  {path:'main', component: MainComponent , data: { breadcrumb: 'Home' }, canActivate: [AuthGuard]},
  {path:'documentos', component: DocumentosComponent, data: { breadcrumb: 'Documentos' }, canActivate: [AuthGuard] },
  {path: 'apps', component: AplicacionesComponent, data: { breadcrumb: 'Aplicaciones' }, canActivate: [AuthGuard] },
  {path: 'functions', component: FuncionesComponent, data: { breadcrumb: 'Funciones' }, canActivate: [AuthGuard] },
  {path: 'transact', component: TransaccionesComponent, data: { breadcrumb: 'Transacciones' }, canActivate: [AuthGuard] },
  {path: 'users', component: UsuariosComponent, data: { breadcrumb: 'Usuarios' }, canActivate: [AuthGuard] },
  {path: 'rol', component: RolesComponent, data: { breadcrumb: 'Roles' }, canActivate: [AuthGuard] },
  {path: 'ruteo', component: RuteoComponent, data: { breadcrumb: 'Ruteo' }, canActivate: [AuthGuard] },
  {path: 'solicoti', component: SolicotiComponent, data: { breadcrumb: 'Cotizacion' }, canActivate: [AuthGuard] },
  {path: 'solioc', component: SoliocComponent, data: { breadcrumb: 'Orden de compra' }, canActivate: [AuthGuard] },
  {path: 'solipago', component: SolipagoComponent, data: { breadcrumb: 'Pago' }, canActivate: [AuthGuard] },
  {path: 'mainconfig', component: MainConfiguracionComponent, data: { breadcrumb: 'Solicitudes' }, canActivate: [AuthGuard] },
  {path: 'mainsec', component: MainSeguridadComponent, data: { breadcrumb: 'Seguridad' }, canActivate: [AuthGuard] },
  {path: 'empleados', component: EmpleadosComponent, data: { breadcrumb: 'Empleados' }, canActivate: [AuthGuard] },
  {path: 'solAprob', component: SolicitudesAprobadasComponent, data: { breadcrumb: 'Solicitudes Aprobadas' }, canActivate: [AuthGuard] },
  {path: 'solNoAprob', component: SolicitudesNoAprobadasComponent, data: { breadcrumb: 'Solicitudes No Aprobadas' }, canActivate: [AuthGuard] },
  {path: 'allrequest', component: AllrequestComponent, data: { breadcrumb: 'Todas las solicitudes' }, canActivate: [AuthGuard] },
  {path: 'rolTransc', component: RolesTransacComponent, data: { breadcrumb: 'Roles-Transacciones' }, canActivate: [AuthGuard] },
  {path: 'rolUser', component: RolesUsersComponent, data: { breadcrumb: 'Roles-Usuarios' }, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
