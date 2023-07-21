import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Niveles } from 'src/app/models/Niveles';
import { CommunicationApiService } from 'src/app/services/communication-api.service';

@Component({
  selector: 'app-ruteo',
  templateUrl: './ruteo.component.html',
  styleUrls: ['./ruteo.component.css']
})
export class RuteoComponent implements OnInit{
  //variables que almacenan los datos de los niveles asignados
  rutArea: number = 0;
  rutTipoSol: number = 0;


  /*lista para guardar los niveles seleccionados, la cantidad de elementos depende de los niveles creados en la base de datos, 
  si se añaden mas niveles hay que actualizar esta lista*/
  nivelesList: Niveles[] = [{nivel: 10, estado:true },{nivel: 20, estado:false },
                            {nivel: 30, estado:false },{nivel: 40, estado:false },
                            {nivel: 50, estado:false },{nivel: 60, estado:false },
                            {nivel: 70, estado:false }];

  //listas obervables
  areaList$!: Observable<any[]>;
  TipoSol$!: Observable<any[]>;
  nivelRut$!: Observable<any[]>;


  //variables para controlar la funcionalidad de la pagina
  changeview: string = 'editar';  
  constructor(private service:CommunicationApiService) {}


  ngOnInit(){
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
    this.changeview = 'editar';
  }

  clear(): void {
  }
}

