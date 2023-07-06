import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/plantillas/header/header.component';
import { SidebarComponent } from './components/plantillas/sidebar/sidebar.component';
import { DocumentosComponent } from './components/configuracion/documentos/documentos.component';
import { EmpleadosComponent } from './components/configuracion/empleados/empleados.component';
import { RuteoComponent } from './components/configuracion/ruteo/ruteo.component';
import { AplicacionesComponent } from './components/configuracion/seguridad/aplicaciones/aplicaciones.component';
import { FuncionesComponent } from './components/configuracion/seguridad/funciones/funciones.component';
import { TransaccionesComponent } from './components/configuracion/seguridad/transacciones/transacciones.component';
import { UsuariosComponent } from './components/configuracion/seguridad/usuarios/usuarios.component';
import { RolesComponent } from './components/configuracion/seguridad/roles/roles.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DocumentosComponent,
    EmpleadosComponent,
    RuteoComponent,
    AplicacionesComponent,
    FuncionesComponent,
    TransaccionesComponent,
    UsuariosComponent,
    RolesComponent,
    LoginComponent,
    MainComponent
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
