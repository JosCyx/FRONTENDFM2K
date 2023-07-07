import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/plantillas/header/header.component';
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
import { FormsModule } from '@angular/forms';
import { SolicotiComponent } from './components/procesos/solicoti/solicoti.component';
import { SoliocComponent } from './components/procesos/solioc/solioc.component';
import { SolipagoComponent } from './components/procesos/solipago/solipago.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
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
    SolipagoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
