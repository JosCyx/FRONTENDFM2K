import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationApiService } from 'src/app/services/communication-api.service';

@Component({
  selector: 'app-allrequest',
  templateUrl: './allrequest.component.html',
  styleUrls: ['./allrequest.component.css']
})
export class AllrequestComponent implements OnInit{

  tipoSol$!: Observable<any[]>;
  allSol$!: Observable<any[]>;
  empleadoList$!: Observable<any[]>;
  bsqTipoSol!: number;

  changeview: string = 'consultar';

  constructor(private service: CommunicationApiService){}
  
  ngOnInit(): void {
    this.tipoSol$ = this.service.getTipoSolicitud();
    this.empleadoList$ = this.service.getEmpleadosList();
    
  }

  consultarSol():void{
    this.allSol$ = this.service.getCabbyTipoSol(this.bsqTipoSol);
  }
  
  changeView(view: string): void {
    this.changeview = view;
  }
}
