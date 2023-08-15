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

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path:'login', component: LoginComponent},
  {path:'main', component: MainComponent , data: { breadcrumb: 'Home' } },
  {path:'documentos', component: DocumentosComponent, data: { breadcrumb: 'Documentos' } },
  {path: 'apps', component: AplicacionesComponent, data: { breadcrumb: 'Aplicaciones' } },
  {path: 'functions', component: FuncionesComponent, data: { breadcrumb: 'Funciones' } },
  {path: 'transact', component: TransaccionesComponent, data: { breadcrumb: 'Transacciones' } },
  {path: 'users', component: UsuariosComponent, data: { breadcrumb: 'Usuarios' } },
  {path: 'rol', component: RolesComponent, data: { breadcrumb: 'Roles' } },
  {path: 'ruteo', component: RuteoComponent, data: { breadcrumb: 'Ruteo' } },
  {path: 'solicoti', component: SolicotiComponent, data: { breadcrumb: 'Cotizacion' } },
  {path: 'solioc', component: SoliocComponent, data: { breadcrumb: 'Orden de compra' } },
  {path: 'solipago', component: SolipagoComponent, data: { breadcrumb: 'Pago' } },
  {path: 'mainconfig', component: MainConfiguracionComponent, data: { breadcrumb: 'Solicitudes' } },
  {path: 'mainsec', component: MainSeguridadComponent, data: { breadcrumb: 'Seguridad' } },
  {path: 'empleados', component: EmpleadosComponent, data: { breadcrumb: 'Empleados' } },
  {path: 'allrequest', component: AllrequestComponent, data: { breadcrumb: 'Todas las solicitudes' } }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
