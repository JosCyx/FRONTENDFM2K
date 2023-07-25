import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Niveles } from 'src/app/models/Niveles';
import { CommunicationApiService } from 'src/app/services/communication-api.service';

@Component({
  selector: 'app-ruteo',
  templateUrl: './ruteo.component.html',
  styleUrls: ['./ruteo.component.css']
})
export class RuteoComponent implements OnInit {
  //variables que almacenan los datos de los niveles asignados
  rutArea: number = 0;
  rutTipoSol: number = 0;

  nvNivel: string = '';
  nvDescp: string = '';
  nvEstado: string = '';


  /*lista para guardar los niveles seleccionados, la cantidad de elementos depende de los niveles creados en la base de datos, 
  si se añaden mas niveles hay que actualizar esta lista*/
  nivelesList: Niveles[] = [
  { nivel: 10, estado: false }, { nivel: 20, estado: false },
  { nivel: 30, estado: false }, { nivel: 40, estado: false },
  { nivel: 50, estado: false }, { nivel: 60, estado: false },
  { nivel: 70, estado: false }];

  nivGuardados: any[] =[];

  ruteoList: any[] = [];

  //listas observables
  areaList$!: Observable<any[]>;
  TipoSol$!: Observable<any[]>;
  nivelRut$!: Observable<any[]>;


  //variables para controlar la funcionalidad de la pagina
  changeview: string = 'consultar';
  mensajeExito: string = '';
  mensajeError: string = '';
  busqArea: number = 0;
  nivGuardar: number = 0;
  showmsjNivel: boolean = false;

  constructor(private service: CommunicationApiService) { }


  ngOnInit() {
    this.areaList$ = this.service.getAreaList();
    this.TipoSol$ = this.service.getTipoSolicitud();
    this.nivelRut$ = this.service.getNivelruteo();
  }

  changeView(view: string): void {
    this.clear();
    this.changeview = view;
  }

  cancelar(): void {
    this.clear();
    this.changeview = 'consultar';
  }

  clear(): void {
    this.rutArea = 0;
    this.rutTipoSol = 0;
    this.nivGuardados = [];
    for (let nivel of this.nivelesList) {
      nivel.estado = false;
    }

  }

  changeEstado(nivel: Niveles) {
    nivel.estado = !nivel.estado; // Cambia el estado del checkbox (true a false o false a true)
  }

  guardarRuteo() {
    console.log("inicio de guardado");

    for (let nivel of this.nivelesList) {
      if (nivel.estado === true) {

        this.service.checkRuteoExistence(this.rutTipoSol, this.rutArea, nivel.nivel).subscribe(
          (data: any) => {
            if (data) {
              // Si el ruteo ya existe se guardan los valores de los niveles en una lista para mostrarlos en un mensaje
              console.log(`El ruteo para el nivel ${nivel.nivel} ya existe.`);
              
              this.nivGuardar = nivel.nivel;
              
              this.nivGuardados.push(this.nivGuardar);

              this.showmsjNivel = true;

              setTimeout(() => {
                this.showmsjNivel = false;
                this.nivGuardados = [];
                //this.clear();          
              }, 1800);
              
            } else {
              // Si el ruteo no existe se crea el arreglo y se envia a la API
              const data = {
                rutareaTipoSol: this.rutTipoSol,
                rutareaArea: this.rutArea,
                rutareaNivel: nivel.nivel
              };

              
              this.service.addRuteos(data).subscribe(
                () => {
                  console.log('Ruteo agregado exitosamente');
                  this.mensajeExito = 'Niveles asignados exitosamente.';
                  setTimeout(() => {
                    this.mensajeExito = '';
                    this.clear();
                    //this.changeview = 'consultar';
                  }, 1500);
                },
                error => {
                  this.mensajeError = 'Error intente de nuevo.';
                  console.log('Error:', error);
                }
              );
            }
          },
          error => {
            // Manejo de errores en la petición para verificar la existencia del ruteo
            this.mensajeError = 'Error al verificar la existencia del ruteo.';
            console.log('Error al verificar la existencia del ruteo:', error);
          }
        );

      }
    }
  }

  consultarRuteo() {
    this.service.getRuteosByArea(this.busqArea).subscribe(
      response => {
        this.ruteoList = response;
        console.log("Exito: ",this.ruteoList);
      },
      error => {
        console.log("Error: ",this.ruteoList);
        console.log("Error al consultar el ruteo: ", error);
      }
    );

  }

  //crea un arreglo con los valores necesarios y lo envía a la API para crear un nuevo nivel
  agregarNivel(): void {

    const data = {
      nivel: this.nvNivel,
      descRuteo: this.nvDescp,
      estadoRuteo: this.nvEstado
    }

    this.service.addnivelRuteo(data).subscribe(
      response => {
        console.log("Nivel añadido correctamente.");
        this.mensajeExito = 'Nivel registrado exitosamente.';
        setTimeout(() => {
          this.mensajeExito = '';
          this.clear();
          this.changeview = 'consultar';
        }, 1500);
      },
      error => {
        this.mensajeError = 'Error intente de nuevo.';
        setTimeout(() => {
          this.mensajeError = '';
          this.clear();
        }, 1500);
        console.log("Error al añadir el nivel: ", error);
      }
    );
  }
}

