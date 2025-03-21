import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { GlobalAusService } from 'src/app/services/global-aus.service';

@Component({
  selector: 'app-vista-listado-marcaciones',
  templateUrl: './vista-listado-marcaciones.component.html',
  styleUrls: ['./vista-listado-marcaciones.component.css']
})
export class VistaListadoMarcacionesComponent {
    @ViewChild('mat-paginator') "paginator": MatPaginator;

    displayedColumns: string[] = ['Area', 'Departamento', 'Solicitante', 'fecha', 'motivo', 'estado'];
    dataSource =new MatTableDataSource<any>();

    //private confirmSubscription: Subscription;
    
    /*constructor(
      public globalAusService: GlobalAusService,
     // private cookieService: CookieService

    ) { 
      this.confirmSubscription = this.globalAusService.
      //confirmObserv.subscribe()

    }*/

}
