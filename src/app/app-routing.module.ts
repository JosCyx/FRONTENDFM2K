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
import { RolesTransacComponent } from './components/seguridad/roles-transac/roles-transac.component';
import { RolesUsersComponent } from './components/seguridad/roles-users/roles-users.component';
import { EmpleadoNivelComponent } from './components/seguridad/empleado-nivel/empleado-nivel.component';
import { ReportesComponent } from './components/procesos/reportes/reportes.component';
import { SolicitudesAprobadasComponent } from './components/procesos/solicitudes-aprobadas/solicitudes-aprobadas.component';
import { MainNominaComponent } from './nomina/components/main/main-nomina/main-nomina.component';
import { SendNominaRolComponent } from './nomina/components/procesos/send-nomina-rol/send-nomina-rol.component';

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
  {path: 'allrequest', component: AllrequestComponent, data: { breadcrumb: 'Todas las solicitudes' }, canActivate: [AuthGuard] },
  {path: 'rolTransc', component: RolesTransacComponent, data: { breadcrumb: 'Roles-Transacciones' }, canActivate: [AuthGuard] },
  {path: 'rolUser', component: RolesUsersComponent, data: { breadcrumb: 'Roles-Usuarios' }, canActivate: [AuthGuard] },
  {path: 'empnivel', component: EmpleadoNivelComponent, data: { breadcrumb: 'Empleado-Nivel' }, canActivate: [AuthGuard] },
  {path: 'solAprob', component: SolicitudesAprobadasComponent, canActivate: [AuthGuard]},
  {path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard] },
  {path: 'mainnom', component: MainNominaComponent, canActivate: [AuthGuard]},
  {path: 'sendrol', component: SendNominaRolComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
