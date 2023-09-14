import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentosComponent } from './components/configuracion/documentos/documentos.component';
import { EmpleadosComponent } from './components/configuracion/empleados/empleados.component';
import { RuteoComponent } from './components/configuracion/ruteo/ruteo.component';
import { AplicacionesComponent } from './components/seguridad/aplicaciones/aplicaciones.component';
import { FuncionesComponent } from './components/seguridad/funciones/funciones.component';
import { TransaccionesComponent } from './components/seguridad/transacciones/transacciones.component';
import { UsuariosComponent } from './components/seguridad/usuarios/usuarios.component';
import { RolesComponent } from './components/seguridad/roles/roles.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SolicotiComponent } from './components/procesos/solicoti/solicoti.component';
import { SoliocComponent } from './components/procesos/solioc/solioc.component';
import { SolipagoComponent } from './components/procesos/solipago/solipago.component';
import { MainSeguridadComponent } from './components/seguridad/main-seguridad.component';
import { MainConfiguracionComponent } from './components/configuracion/main-configuracion.component';
import { MenuComponent } from './components/templates/menu/menu.component';
import { MenuAdminComponent } from './components/templates/menu-admin/menu-admin.component';
import { AllrequestComponent } from './components/procesos/allrequest/allrequest.component';
import { BreadcrumbComponent } from './components/templates/breadcrumb/breadcrumb.component';
import { AuthService } from './services/authentication/auth.service';
import { CotProveedoresComponent } from './components/procesos/solicoti/cot-proveedores/cot-proveedores.component';
import { CotDocumentacionComponent } from './components/procesos/solicoti/cot-documentacion/cot-documentacion.component';

@NgModule({
  declarations: [
    AppComponent,
    DocumentosComponent,
    EmpleadosComponent,
    RuteoComponent,
    AplicacionesComponent,
    FuncionesComponent,
    TransaccionesComponent,
    UsuariosComponent,
    RolesComponent,
    LoginComponent,
    MainComponent,
    SolicotiComponent,
    SoliocComponent,
    SolipagoComponent,
    MainSeguridadComponent,
    MainConfiguracionComponent,
    MenuComponent,
    MenuAdminComponent,
    AllrequestComponent,
    BreadcrumbComponent,
    CotProveedoresComponent,
    CotDocumentacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    ModalModule.forRoot()
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

