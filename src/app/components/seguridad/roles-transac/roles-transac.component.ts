import { Component, OnInit } from '@angular/core';
import { RolesService } from 'src/app/services/comunicationAPI/seguridad/roles.service';
import { TransaccionesService } from 'src/app/services/comunicationAPI/seguridad/transacciones.service';

@Component({
  selector: 'app-roles-transac',
  templateUrl: './roles-transac.component.html',
  styleUrls: ['./roles-transac.component.css']
})
export class RolesTransacComponent implements OnInit{

  transacList!: any[];
  rolList!: any[];
  rolAsign: number =0;

  changeview:string = 'asignar';

  constructor(private transacService: TransaccionesService,
              private rolService: RolesService) { }

  ngOnInit(): void {
    this.transacService.getTransaccionesList().subscribe(
      response => {
        this.transacList = response;
      },
      error => {
        console.log(error);
      }
    );

    this.rolService.getRolsList().subscribe(
      response => {
        this.rolList = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  changeView(view: string){
    this.changeview = view;
  }

  


}
