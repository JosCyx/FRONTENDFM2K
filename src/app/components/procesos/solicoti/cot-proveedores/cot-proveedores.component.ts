import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ProveedorService } from 'src/app/services/comunicationAPI/seguridad/proveedor.service';

@Component({
  selector: 'app-cot-proveedores',
  templateUrl: './cot-proveedores.component.html',
  styleUrls: ['./cot-proveedores.component.css']
})
export class CotProveedoresComponent {

  constructor(private provService: ProveedorService){}

  //variables de busqueda
  tipoBusqProv: string = 'nombre';
  terminoBusq!: string;

  //lista de proveedores seleccionados
  proveedorListSelected: any[] = [];

  //resultados de busqueda
  proveedoresList$!: Observable<any[]>;

  searchProveedor(){
    if(this.tipoBusqProv == 'nombre'){
      console.log("busqueda por nombre");
      this.proveedoresList$ = this.provService.getProveedorByNombre(this.terminoBusq);

    } else if(this.tipoBusqProv == 'ruc'){
      console.log("busqueda por ruc");
      this.proveedoresList$ = this.provService.getProveedorByRUC(this.terminoBusq);
    }
  }

  selectProveedor(prov:any){
    //console.log(prov);

    //verificar si proveedor ya esta agregado a lista

    if(this.verifyProvExists(prov)){
      console.log("El proveedor ya ha sido añadido a la lista.")
    } else {
      this.proveedorListSelected.push(prov);
    }

  }

  verifyProvExists(prov:any){
    return this.proveedorListSelected.some((item: any) => {
      return (
        item.prov_nombre === prov.prov_nombre &&
        item.prov_ruc === prov.prov_ruc
      );
    });     

  }

  deleteProvSelected(id:number){
    this.proveedorListSelected.splice(id,1);
  }

  sendMailtoProv(){

  }
}
