import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { GeneralControllerService } from 'src/app/services/comunicationAPI/inventario/general-controller.service';
import { MovimientosControllerService } from 'src/app/services/comunicationAPI/inventario/movimientos-controller.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { GlobalInventarioService } from 'src/app/services/global-inventario.service';

@Component({
  selector: 'app-asignar-producto',
  templateUrl: './asignar-producto.component.html',
  styleUrls: ['./asignar-producto.component.css']
})
export class AsignarProductoComponent {
  productoSeleccionado: any = '';
  filteredOptions!: Observable<any[]>;
  productsToAsign: { codigo: number, nombre: string }[] = [];

  errorAsign: boolean = false;
  errorMessage: string = '';

  //lista de productos para asignar
  productosList: any[] = [];

  myControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<AsignarProductoComponent>,
    private dialogService: DialogServiceService,
    private generalService: GeneralControllerService,
    private movService: MovimientosControllerService,
    private globalInvService: GlobalInventarioService
  ){
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    setTimeout(() => {
      this.generalService.getGeneralData(3,0).subscribe(
        (data) => {
          this.productosList = data;
          //console.log("productos: ",data);
        },
        (error) => {
          console.error(error);
        }
      );
    }, 100);
  }

  private _filter(value: string): {codigo: number, nombre: string}[] {
    const filterValue = value.toLowerCase();
    return this.productosList.filter(product => product.nombre.toLowerCase().includes(filterValue));
  }

  onOptionSelected(nombre: string) {
    if (nombre.trim() === '') {
      this.errorAsign = true;
      this.errorMessage = 'No se puede asignar un producto vacío.';
      setTimeout(() => { this.errorAsign = false; }, 2500);
    } else if (this.productsToAsign.some(product => product.nombre === nombre.trim())) {
      this.errorAsign = true;
      this.errorMessage = 'Este producto ya ha sido asignado.';
      setTimeout(() => { this.errorAsign = false; }, 2500);
    } else {
      const product = this.productosList.find(product => product.nombre === nombre);
      if (product) {
        const producto = {
          codigo: product.codigo,
          nombre: nombre.trim()
        }
        this.productsToAsign.push(producto); // Agregar el producto seleccionado
        this.myControl.setValue(''); // Limpiar el input después de agregar el producto
        //console.log("productos listos para asignar: ", this.productsToAsign);
      } else {
        this.errorAsign = true;
        this.errorMessage = 'Producto no encontrado.';
        setTimeout(() => { this.errorAsign = false; }, 2500);
      }
    }
  }

  /*addProdcut() {
    if (this.productoSeleccionado.trim() == '') {
      this.errorAsign = true;
      this.errorMessage = 'No se puede asignar un producto vacío.';

      setTimeout(() => {
        this.errorAsign = false;
      }, 2500);

    } else if (this.productsToAsign.some(product => product.nombre === this.productoSeleccionado.trim())) {
      this.errorAsign = true;
      this.errorMessage = 'Este producto ya ha sido asignado.';

      setTimeout(() => {
        this.errorAsign = false;
      }, 2500);
    }
    else {
      const product = this.productosList.find(product => product.nombre === this.productoSeleccionado.trim());

      if (product) {

        const producto = {
          codigo: product.codigo,
          nombre: this.productoSeleccionado.trim()
        }

        this.productsToAsign.push(producto); // Agregar el producto seleccionado
        this.productoSeleccionado = ''; // Limpiar el input después de agregar el producto
      } else {
        this.errorAsign = true;
        this.errorMessage = 'Producto no encontrado.';

        setTimeout(() => {
          this.errorAsign = false;
        }, 2500);
      
      }
    }
  }*/

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  /*eliminar(producto: any) {
    console.log("producto a eliminar: ", producto);
    const index = this.productsToAsign.indexOf(producto.nombre);
    this.productsToAsign.splice(index, 1);
  }*/

  eliminarProducto(producto: any) {
    const productoNombreLimpio = producto.nombre.trim(); // Limpiar el nombre del producto recibido
  
    const index = this.productsToAsign.findIndex(p => p.codigo === producto.codigo && p.nombre.trim() === productoNombreLimpio);
    
    if (index !== -1) {
      this.productsToAsign.splice(index, 1);
      //console.log(`Producto con código ${producto.codigo} eliminado.`);
    } else {
      console.error('Producto no encontrado.');
    }
  }
  

  cancelarAsignacion() {
    this.dialogRef.close();
    this.productsToAsign = [];
    this.productoSeleccionado = '';

  }

  //eliminar los productos de la lista
  clearProducts() {
    this.productosList = [];
  }

  //asignar los productos al sector
  asignProducts() {

    if(this.productsToAsign.length == 0){
      this.callMensaje('Debe seleccionar al menos un producto para asignar.', false);
      return;
    }

    let exito = true;

    this.productsToAsign.forEach((producto) => {

      const data = {
        cantsecIdGrupo: this.globalInvService.sectorSelected,
        cantsecIdProducto: producto.codigo,
        cantsecCantidad: 0
      }

      this.movService.InsertCantidad(data).subscribe(
        (data) => {
          this.dialogRef.close();
          //setear el observable como true para que se actualice la tabla
          this.globalInvService.setConfirmObserv(true);
        },
        (error) => {
          exito = false;
          console.log("Error al asignar el producto:", producto, "error", error);
          this.callMensaje('Error al asignar el producto', false);
        }
      )
    });

    if (exito) {
      this.callMensaje('Producto asignado correctamente.', true);
      this.productsToAsign = [];
    }
  }

  launchRegisterProduct(){
    this.dialogRef.close();
    this.dialogService.openRegistroProductoDialog();
  }
}
