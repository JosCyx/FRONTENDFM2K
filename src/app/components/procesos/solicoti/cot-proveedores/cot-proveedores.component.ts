import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ProveedorService } from 'src/app/services/comunicationAPI/seguridad/proveedor.service';
import { ProvCotizacionService } from 'src/app/services/comunicationAPI/solicitudes/prov-cotizacion.service';

interface selectedProveedor {
  ruc: string,
  nombre: string,
  telefono: string,
  correo: string,
  validEmail: boolean,
  direccion: string
}


@Component({
  selector: 'app-cot-proveedores',
  templateUrl: './cot-proveedores.component.html',
  styleUrls: ['./cot-proveedores.component.css']
})
export class CotProveedoresComponent implements OnInit {
  //valores para identificar la solicitud cargada
  @Input() tipoSol: number = 0;
  @Input() noSol: number = 0;

  //variables para controlar comportamiento de la pagina
  actionProv: string = 'consultar';
  hasProvs: boolean = false;

  //variables de acciones de proveedores asignados
  idDltProv!: number;
  emailProv!: string;

  //formulario para añadir un nuevo proveedor
  dataForm = new FormGroup({
    newRuc: new FormControl("", [
      Validators.required
    ]),
    newNombre: new FormControl("", [
      Validators.required
    ]),
    newDireccion: new FormControl("", [
      Validators.required
    ]),
    newEmail: new FormControl("", [
      Validators.required,
      Validators.email
    ]),
    newPhone: new FormControl("", [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]),
    newCodePhone: new FormControl("593", [
      Validators.required
    ])
  });

  get Ruc(): FormControl {
    return this.dataForm.get("newRuc") as FormControl;
  }

  get Nombre(): FormControl {
    return this.dataForm.get("newNombre") as FormControl;
  }

  get Direccion(): FormControl {
    return this.dataForm.get("newDireccion") as FormControl;
  }

  get Email(): FormControl {
    return this.dataForm.get("newEmail") as FormControl;
  }

  get Phone(): FormControl {
    return this.dataForm.get("newPhone") as FormControl;
  }

  get CodePhone(): FormControl {
    return this.dataForm.get("newCodePhone") as FormControl;
  }

  //variables de busqueda
  tipoBusqProv: string = 'nombre';
  terminoBusq: string = '';
  isSearched: boolean = true;
  page: number = 1; // Inicializa la página actual en 1
  showmsj: boolean = false;
  showadv: boolean = false;
  msjError: string = '';

  //lista de proveedores seleccionados
  proveedorListSelected: selectedProveedor[] = [];

  //resultados de busqueda
  proveedoresList$!: Observable<any[]>;
  proveedoresList: any[] = [];

  //lista para los proveedores asignados a la cotizacion
  assignedProvs$!: Observable<any[]>;

  constructor(private provService: ProveedorService,
    private provCotService: ProvCotizacionService) { }

  ngOnInit(): void {
    this.getProvCotizacion();
  }

  searchProveedor() {
    this.page = 1;
    if (this.terminoBusq == '') {
      this.proveedoresList = [];
      this.isSearched = false;

      this.showmsj = true;
      this.msjError = 'Ingrese un nombre o ruc para buscar proveedores.';

      setTimeout(() => {
        this.isSearched = true;
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

  selectAction(action: string) {
    this.actionProv = action;
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
        direccion: '',
        validEmail: true
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

  verifyPhoneEmailProv(): boolean {
    for (let prov of this.proveedorListSelected) {
      if (!prov.telefono || prov.telefono === '' || !prov.correo || prov.correo === '') {
        return false;
      }
    }
    return true;
  }

  verifyValidEmail(correo: string): boolean {
    const patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return patronCorreo.test(correo);
  }

  validarProvEmail(index: number) {

    for (let i = 0; i < this.proveedorListSelected.length; i++) {
      const element = this.proveedorListSelected[i];

      if(i == index){
        //console.log(element.correo);
        element.validEmail = this.verifyValidEmail(element.correo);
        console.log(element);
      }
      
    }
  }


  deleteProvSelected(id: number) {
    this.proveedorListSelected.splice(id, 1);
  }

  addProveedor() {
    if (
      this.dataForm.valid
    ) {
      // Si todos los campos están llenos, agrega el proveedor a la lista
      const newPrv = {
        ruc: this.dataForm.value.newRuc!,
        nombre: this.dataForm.value.newNombre!,
        telefono: this.dataForm.value.newCodePhone! + ' ' + this.dataForm.value.newPhone!,
        correo: this.dataForm.value.newEmail!,
        direccion: this.dataForm.value.newDireccion!,
        validEmail: true
      }
      console.log(this.dataForm.value)
      this.proveedorListSelected.push(newPrv);

      //limpiar el formulario
      this.clearNewPrv();


    } else {
      // Muestra una alerta o mensaje de error al usuario indicando que los campos deben llenarse.
      alert('Error, no se han completado todos los datos necesarios.');
    }
  }

  clearNewPrv() {
    this.dataForm.reset();
  }

  saveProvDB() {
    if (this.verifyPhoneEmailProv()) {
      console.log(this.proveedorListSelected);



      for (let prov of this.proveedorListSelected) {

        if(prov.validEmail === false){
          alert(`Error al asignar el proveedor ${prov.nombre}, el correo ingresado no es válido, por favor intente nuevamente.`)
        } else {
          const data = {
            cotProvTipoSolicitud: this.tipoSol,
            cotProvNoSolicitud: this.noSol,
            cotProvRuc: prov.ruc,
            cotProvNombre: prov.nombre,
            cotProvTelefono: prov.telefono,
            cotProvCorreo: prov.correo,
            cotProvDireccion: prov.direccion
          }
          this.provCotService.addProvCotizacion(data).subscribe(
            response => {
              //console.log("Proveedor guardado exitosamente: ", prov.nombre);
              
              this.actionProv = 'consultar';
            },
            error => {
              if (error.status == 409) {
                //console.log("Error, este proveedor ya se ha asignado:", error);
                this.showadv = true;
                this.msjError = `El proveedor ${data.cotProvNombre} ya está asignado a esta solicitud.`;
  
                setTimeout(() => {
                  this.actionProv = 'consultar';
                  this.isSearched = true;
                  this.showadv = false;
                  this.msjError = '';
                }, 5000)
  
              } else {
                console.log("Error:", error);
              }
            }
          );
        }
      }
      this.hasProvs = true;
      this.proveedorListSelected = [];
      this.proveedoresList = [];
      this.terminoBusq = '';

      setTimeout(() => {
        this.getProvCotizacion();
      }, 100);
    } else {
      alert("Debe llenar todos los campos requeridos antes de guardar los proveedores.")
    }

  }

  getProvCotizacion() {
    this.assignedProvs$ = this.provCotService.getProvCot(this.tipoSol, this.noSol);
    this.assignedProvs$.subscribe(
      response => {
        console.log("Conulta exitosa: ", response);
        this.hasProvs = true;
      },
      error => {
        console.log("Error:", error);
      }
    );
  }

  deleteProvAssigned() {
    this.provCotService.deleteProvCot(this.idDltProv).subscribe(
      response => {
        console.log("Proveedor eliminado: ", response);
        this.getProvCotizacion();
      },
      error => {
        console.log("Error:", error);
      }
    );
  }

  //guarda el id del proveedor para eliminar
  selectIdDltProv(id: number) {
    this.idDltProv = id;
  }

  //guarda el correo del proveedor para enviar email
  selectEmailProv(email: string) {
    this.emailProv = email;
  }

  //enviar el correo al proveedor seleccionado
  sendMailtoProv() {


  }

  //generar el pdf con los datos de la cotizacion
  generatePDFCot() {

  }
}
