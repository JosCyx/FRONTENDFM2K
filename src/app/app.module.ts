import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
//Dependencias  Angular PDF View
//Material UI Angular
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
//-------
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

//I keep the new line
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MainNominaComponent } from './nomina/components/main/main-nomina/main-nomina.component';
import { SendNominaRolComponent } from './nomina/components/procesos/send-nomina-rol/send-nomina-rol.component';
import { MenuNominaComponent } from './components/templates/menu-nomina/menu-nomina.component';

import { SpDestinoComponent } from './components/procesos/solipago/sp-destino/sp-destino.component';
import { RolesTransacComponent } from './components/seguridad/roles-transac/roles-transac.component';
import { RolesUsersComponent } from './components/seguridad/roles-users/roles-users.component';
import { CotPdfComponent } from './components/procesos/solicoti/cot-pdf/cot-pdf.component';
import { CotAnulacionComponent } from './components/procesos/solicoti/cot-anulacion/cot-anulacion.component';
import { OcAnulacionComponent } from './components/procesos/solioc/oc-anulacion/oc-anulacion.component';
import { SpAnulacionComponent } from './components/procesos/solipago/sp-anulacion/sp-anulacion.component';
import { OcPdfComponent } from './components/procesos/solioc/oc-pdf/oc-pdf.component';
import { SpPdfComponent } from './components/procesos/solipago/sp-pdf/sp-pdf.component';
import { EmpleadoNivelComponent } from './components/seguridad/empleado-nivel/empleado-nivel.component';
import { DialogComponentComponent } from './components/templates/dialog-component/dialog-component.component';
import { SolicitudesAprobadasComponent } from './components/procesos/solicitudes-aprobadas/solicitudes-aprobadas.component';
import { DialogServiceService } from './services/dialog-service.service';
import { ReportesComponent } from './components/procesos/reportes/reportes.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

//BITACORA

import { MainBitacoraComponent } from './bitacora/components/main-bitacora/main-bitacora.component';
import { MenuBitacoraComponent } from './components/templates/menu-bitacora/menu-bitacora.component';
import { PermisoRegistradoComponent } from './bitacora/components/procesos/permiso-registrado/permiso-registrado.component';
import { CalendarioComponent } from './bitacora/components/procesos/calendario/calendario.component';
import { IngresoPermisoComponent } from './bitacora/components/procesos/ingreso-permiso/ingreso-permiso.component';

import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { PermisosVariosComponent } from './bitacora/components/procesos/permisos-varios/permisos-varios.component';


//I keep the new line

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
    SpDestinoComponent,
    RolesTransacComponent,
    RolesUsersComponent,
    CotPdfComponent,
    CotAnulacionComponent,
    OcAnulacionComponent,
    SpAnulacionComponent,
    OcPdfComponent,
    SpPdfComponent,
    EmpleadoNivelComponent,
    DialogComponentComponent,
    ReportesComponent,
    SolicitudesAprobadasComponent,
    MainNominaComponent,
    SendNominaRolComponent,
    MenuNominaComponent,
    MainBitacoraComponent,
    MenuBitacoraComponent,
    PermisoRegistradoComponent,
    CalendarioComponent,
    IngresoPermisoComponent,
    PermisosVariosComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatGridListModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatExpansionModule,
    
    
    
  ],
  providers: [AuthService, MatDialog, DialogServiceService],
  bootstrap: [AppComponent]
  
})

export class AppModule {
  
}

