import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Producto } from 'src/app/models/inventario/Producto';
import { GeneralControllerService } from 'src/app/services/comunicationAPI/inventario/general-controller.service';
import * as _ from 'lodash';
import { ProductoControllerService } from 'src/app/services/comunicationAPI/inventario/producto-controller.service';
import { GlobalInventarioService } from 'src/app/services/global-inventario.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';

@Component({
  selector: 'app-registrar-producto',
  templateUrl: './registrar-producto.component.html',
  styleUrls: ['./registrar-producto.component.css']
})
export class RegistrarProductoComponent {
  //ultimo producto registrado
  lastProductID: number = 0;

  //lista de categorias
  categoriasList: any[] = [];

  //lista de unidades
  unidadesList: any[] = [];

  producto: Producto = {
    nombre: '',
    descripcion: '',
    categoria: 1,
    unidad: 1,
    observ: ''
  };

  isimagen: boolean = false;
  imageSrc: string | ArrayBuffer | null = null;

  imagen!: {
    file: File;
    url: string;
  };

  constructor(
    public dialogRef: MatDialogRef<RegistrarProductoComponent>,
    private generalService: GeneralControllerService,
    private productService: ProductoControllerService,
    private globalInvService: GlobalInventarioService,
    private dialogService: DialogServiceService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.generalService.getGeneralData(1, this.globalInvService.areaSelected).subscribe(
        (data) => {
          this.categoriasList = data;
          //console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );

      this.generalService.getGeneralData(5, 0).subscribe(
        (data) => {
          this.unidadesList = data;
          //console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );

      this.generalService.getGeneralData(7, 0).subscribe(
        (data) => {
          this.lastProductID = data[0].codigo;
          //console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );
    }, 200);
  }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  /*onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imagen = {
          file: selectedFile,
          url: e.target.result
        };
        this.nombre = selectedFile.name;
        this.imageSrc = reader.result;
        this.fileInput.nativeElement.value = '';

        this.isimagen = true;
      };
      reader.readAsDataURL(selectedFile);
    }
  }*/
  
  removeImage(): void {
    //this.imageSrc = null;
    //this.nombre = 'Nombre de la imagen';
  }

  limpiarProducto() {
    this.dialogRef.close();

    this.producto = {
      nombre: '',
      descripcion: ' ',
      unidad: 0,
      categoria: 0,
      observ: ' ',
      imagen: ''
    }
    //this.removeImage();
  }

  calcLastProductID() {
    var lastProductID = _.cloneDeep(this.lastProductID) + 1;
    return lastProductID;
  }

  registrarProducto() {

    if(!this.verifyData()){
      this.callMensaje('Debe llenar todos los campos.', false);
      return;
    }

    const data = {
      ProdCodigo: this.calcLastProductID().toString().padStart(6, '0'),//
      ProdCategoria: this.producto.categoria,//
      ProdNombre: this.producto.nombre,//
      ProdDescripcion: this.producto.descripcion,//
      ProdUnidadMed: this.producto.unidad,//
      ProdObservaciones: this.producto.observ,//
      ProdEstado: 1,//
    };

    //console.log(data);

    this.productService.insertProduct(data, this.globalInvService.sectorSelected).subscribe(
      (data) => {
        //console.log("Exito: ",data);
        this.limpiarProducto();
        this.dialogRef.close();
        this.callMensaje('Producto asignado correctamente.', true);
        this.globalInvService.setConfirmObserv(true);
      },
      (error) => {
        console.error(error);
      }
    );

  }

  verifyData(): boolean {
    if (this.producto.nombre == '') {
      //this.callMensaje('El campo de nombre no puede estar vacío.', false);
      return false;
    }

    if (this.producto.categoria == 0) {
      //this.callMensaje('Debe seleccionar una categoría.', false);
      return false;
    }

    if (this.producto.unidad == 0) {
      //this.callMensaje('Debe seleccionar una unidad de medida.', false);
      return false;
    }

    return true;
  }
}
