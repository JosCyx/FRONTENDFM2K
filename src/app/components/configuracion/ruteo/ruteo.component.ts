import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Niveles } from 'src/app/models/Niveles';
import { Ruteo } from 'src/app/models/Ruteo';
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


  /*lista para guardar los niveles seleccionados, la cantidad de elementos depende de los niveles creados en la base de datos, 
  si se añaden mas niveles hay que actualizar esta lista*/
  nivelesList: Niveles[] = [{ nivel: 10, estado: false }, { nivel: 20, estado: false },
  { nivel: 30, estado: false }, { nivel: 40, estado: false },
  { nivel: 50, estado: false }, { nivel: 60, estado: false },
  { nivel: 70, estado: false }];


  ruteoList: Ruteo[] = [];

  //listas observables
  areaList$!: Observable<any[]>;
  TipoSol$!: Observable<any[]>;
  nivelRut$!: Observable<any[]>;


  //variables para controlar la funcionalidad de la pagina
  changeview: string = 'consultar';
  mensajeExito: string = '';
  mensajeError: string = '';
  busqArea: number = 0;

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

    for (let nivel of this.nivelesList) {
      if (nivel.estado === true) {
        nivel.estado = false;
      }
    }
  }

  changeEstado(nivel: Niveles) {
    nivel.estado = !nivel.estado; // Cambia el estado del checkbox (true a false o false a true)
  }

  guardarRuteo() {
    console.log(this.nivelesList);

    for (let nivel of this.nivelesList) {
      if (nivel.estado === true) {
        /*añadir validacion para ruteos existentes, if ruteo existe(ya se ha asignado el nivel *** a este tipo de solicitud)
        si no (crear el arreglo y guardar los niveles)*/


        //crea el arreglo de datos unicamente cuando el estado de un nivel es true y lo envia a la API
        const data = {
          rutareaTipoSol: this.rutTipoSol,
          rutareaArea: this.rutArea,
          rutareaNivel: nivel.nivel
        }

        this.service.addRuteos(data).subscribe(
          response => {
            console.log('Ruteo agregado exitosamente');
            this.mensajeExito = 'Niveles asignados exitosamente.';
            setTimeout(() => {
              this.mensajeExito = '';
              this.clear();
              this.changeview = 'consultar';
            }, 1500);
          },
          error => {
            this.mensajeError = 'Error intente de nuevo.';
            console.log('NIVEL:' + nivel.nivel);
            console.log('Error:', error);
          }
        );
      }
    }
  }

  /*this.service.getRuteosByArea(this.busqArea).subscribe(
  response => {
    this.ruteoList = response.map(item => {
      const ruteo = new Ruteo();
      ruteo.tipoSol = item.rutareaTipoSol;
      ruteo.area = item.rutareaArea;
      ruteo.nivel = item.rutareaNivel;
      return ruteo;
    });
  },
  error => {
    console.log('Error al obtener los ruteos:', error);
  }
);*/

  consultarRuteo() {

    this.service.getRuteosByArea(this.busqArea).subscribe(
      response => {
        //guardar los elementos traidos en la lista de ruteos
        /*this.ruteoList.tipoSol = response.rutareaTipoSol,
        this.ruteoList.area = response.rutareaArea,
        this.ruteoList.nivel = response.rutareaNivel*/
      },
      error => {

      }
    );

  }
}

