import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ProveedorService } from 'src/app/services/comunicationAPI/seguridad/proveedor.service';

interface selectedProveedor {
  ruc: string,
  nombre: string,
  telefono: string,
  correo: string,
  direccion: string
}


@Component({
  selector: 'app-cot-proveedores',
  templateUrl: './cot-proveedores.component.html',
  styleUrls: ['./cot-proveedores.component.css']
})
export class CotProveedoresComponent {

  constructor(private provService: ProveedorService) { }

  //variables de busqueda
  tipoBusqProv: string = 'nombre';
  terminoBusq: string = '';
  isSearched: boolean = true;
  page: number = 1; // Inicializa la página actual en 1
  showmsj: boolean = false;
  msjError: string = '';

  //variables para crear nuevo proveedor
  newPrvRuc: string = '';
  newPrvNombre: string = '';
  newPrvTelefono: string = '';
  newPrvCorreo: string = '';
  newPrvDireccion: string = '';

  //lista de proveedores seleccionados
  proveedorListSelected: selectedProveedor[] = [];

  //resultados de busqueda
  proveedoresList$!: Observable<any[]>;
  proveedoresList: any[] = [];

  searchProveedor() {
    this.page = 1;
    if (this.terminoBusq == '') {
      this.proveedoresList = [];
      this.isSearched = false;

      this.showmsj = true;
      this.msjError = 'Ingrese un nombre o ruc para buscar proveedores.';

      setTimeout(() => {
        this.showmsj = false;
        this.msjError = '';
      }, 2500)

      
    } else {
      if (this.tipoBusqProv == 'nombre') {
        //console.log("busqueda por nombre");
        this.isSearched = false;
        this.proveedoresList$ = this.provService.getProveedorByNombre(this.terminoBusq);

        this.proveedoresList$.subscribe(
          response => {
            this.proveedoresList = response;
          },
          error => {
            if (error.status == 404) {
              this.showmsj = true;
              this.msjError = 'No se han encontrado proveedores con el dato ingresado, intente nuevamente.';

              setTimeout(() => {
                this.showmsj = false;
                this.msjError = '';
              }, 2500)
            }
            this.proveedoresList = [];
            console.log("Error:", error);
          }
        );

      } else if (this.tipoBusqProv == 'ruc') {
        //console.log("busqueda por ruc");
        this.isSearched = false;
        this.proveedoresList$ = this.provService.getProveedorByRUC(this.terminoBusq);

        this.proveedoresList$.subscribe(
          response => {
            this.proveedoresList = response;
          },
          error => {
            if (error.status == 404) {
              this.showmsj = true;
              this.msjError = 'No se han encontrado proveedores con el dato ingresado, intente nuevamente.';

              setTimeout(() => {
                this.showmsj = false;
                this.msjError = '';
              }, 2500)
            }
            this.proveedoresList = [];
            console.log("Error:", error);
          }
        );
      }
    }
  }

  nextPage(): void {
    this.page++;
  }

  //decrementa el valor de la variable que controla la pagina actual que se muestra
  prevPage(): void {
    if (this.page > 1) {
      this.page--; // Disminuir currentPage en uno si no está en la primera página
    }
  }

  selectProveedor(prov: any) {
    //console.log(prov);

    // Verificar si el proveedor ya está agregado a la lista
    if (this.verifyProvExists(prov)) {
      console.log("El proveedor ya ha sido añadido a la lista.");
    } else {
      // Crear una nueva instancia de selectProveedor con valores de prov
      const nuevoProveedor: selectedProveedor = {
        ruc: prov.prov_ruc || '',
        nombre: prov.prov_nombre || '',
        telefono: prov.prov_telefono || '',
        correo: '',
        direccion: ''
      };

      // Agregar la nueva instancia a la lista proveedorListSelected
      this.proveedorListSelected.push(nuevoProveedor);

    }

  }

  verifyProvExists(prov: any) {
    return this.proveedorListSelected.some((item: any) => {
      return (
        item.nombre === prov.prov_nombre &&
        item.ruc === prov.prov_ruc
      );
    });

  }

  deleteProvSelected(id: number) {
    this.proveedorListSelected.splice(id, 1);
  }

  addProveedor() {
    if (
      this.newPrvRuc != '' &&
      this.newPrvNombre != '' &&
      this.newPrvTelefono != '' &&
      this.newPrvCorreo != ''
    ) {
      // Si todos los campos están llenos, agrega el proveedor a la lista
      const newPrv = {
        ruc: this.newPrvRuc,
        nombre: this.newPrvNombre,
        telefono: this.newPrvTelefono,
        correo: this.newPrvCorreo,
        direccion: this.newPrvDireccion
      }

      this.proveedorListSelected.push(newPrv);

      this.clearNewPrv();


    } else {
      // Muestra una alerta o mensaje de error al usuario indicando que los campos deben llenarse.
      alert('Error, no se han completado todos los datos necesarios.');
    }
  }

  clearNewPrv() {
    this.newPrvCorreo = '';
    this.newPrvDireccion = '';
    this.newPrvNombre = '';
    this.newPrvRuc = '';
    this.newPrvTelefono = '';
  }

  sendMailtoProv() {

    //console.log(this.proveedorListSelected);
  }
}
