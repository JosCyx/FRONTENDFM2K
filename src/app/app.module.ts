import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
//Dependencias  Angular PDF View


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
import { OCDocumentacionComponent } from './components/procesos/solioc/oc-documentacion/oc-documentacion.component';
import { SPDocumentacionComponent } from './components/procesos/solipago/sp-documentacion/sp-documentacion.component';
import { AppAuthorizeTransactionDirective } from './directives/app-authorize-transaction.directive';
import { AppDisableSecureDirective } from './directives/app-disable-secure.directive';

import { SolicitudesAprobadasComponent } from './components/procesos/solicitudes-aprobadas/solicitudes-aprobadas.component';
import { SolicitudesNoAprobadasComponent } from './components/procesos/solicitudes-no-aprobadas/solicitudes-no-aprobadas.component';
import { SpDestinoComponent } from './components/procesos/solipago/sp-destino/sp-destino.component';
import { RolesTransacComponent } from './components/seguridad/roles-transac/roles-transac.component';
import { RolesUsersComponent } from './components/seguridad/roles-users/roles-users.component';
import { CotPdfComponent } from './components/procesos/solicoti/cot-pdf/cot-pdf.component';
import { CotAnulacionComponent } from './components/procesos/solicoti/cot-anulacion/cot-anulacion.component';
import { OcAnulacionComponent } from './components/procesos/solioc/oc-anulacion/oc-anulacion.component';
import { SpAnulacionComponent } from './components/procesos/solipago/sp-anulacion/sp-anulacion.component';
import { OcPdfComponent } from './components/procesos/solioc/oc-pdf/oc-pdf.component';
import { SpPdfComponent } from './components/procesos/solipago/sp-pdf/sp-pdf.component';


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
    CotDocumentacionComponent,
    OCDocumentacionComponent,
    SPDocumentacionComponent,
    AppAuthorizeTransactionDirective,
    AppDisableSecureDirective,
    SolicitudesAprobadasComponent,
    SolicitudesNoAprobadasComponent,
    SpDestinoComponent,
    RolesTransacComponent,
    RolesUsersComponent,
    CotPdfComponent,
    CotAnulacionComponent,
    OcAnulacionComponent,
    SpAnulacionComponent,
    OcPdfComponent,
    SpPdfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

