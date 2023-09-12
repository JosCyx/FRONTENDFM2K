import { Component } from '@angular/core';

@Component({
  selector: 'app-cot-proveedores',
  templateUrl: './cot-proveedores.component.html',
  styleUrls: ['./cot-proveedores.component.css']
})
export class CotProveedoresComponent {

  tipoBusqProv: string = 'nombre';

  searchProveedor(){

    if(this.tipoBusqProv == 'nombre'){
      console.log("nombre");
    } else if(this.tipoBusqProv == 'ruc'){
      console.log("ruc");
    }

  }
}
