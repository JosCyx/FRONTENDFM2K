import { Component } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Router } from '@angular/router';
import { addProd } from 'src/app/models/addproducto/addProd';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-visualizar-inventario',
  templateUrl: './visualizar-inventario.component.html',
  styleUrls: ['./visualizar-inventario.component.css'],
})
export class VisualizarInventarioComponent  {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'categoria', 'observaciones'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  @ViewChild(MatPaginator) "paginator": MatPaginator;
  @ViewChild('fileInput')
  fileInput: any;
  isimagen: boolean = false;
  imageSrc: string | ArrayBuffer | null = null;
  
  productoSeleccionado: string = '';
  productos:any[]=[];

  seleccionarProducto() {

    
    
    if (this.productoSeleccionado.trim() !== '' && !this.productos.includes(this.productoSeleccionado)) {
      this.productos.push(this.productoSeleccionado.trim()); // Agregar el producto seleccionado
      this.productoSeleccionado = ''; // Limpiar el input después de agregar el producto
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

  }
  imagen!: {
    file: File;
    url: string;
  };
  nombre: string = '';
  
  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imagen = {
          file: selectedFile,
          url: e.target.result,
          
        };
        this.nombre = selectedFile.name;
        this.imageSrc = reader.result;
        this.fileInput.nativeElement.value = '';

        this.isimagen = true;
      };

      reader.readAsDataURL(selectedFile);
    }
    
  }

  removeImage(): void {
    this.imageSrc = null;
    this.nombre = 'Nombre de la imagen'; // Reinicia el nombre de la imagen
  }
  constructor(
    private router: Router
  ) { }
  addProd: addProd={
    APProducto: '',
    APCodigo: '',
    APUnidad: 0,
    APCategoria: 0,
    APObservaciones: '',
    APImagen: '',
    
  }
  limpiar(){
    this.addProd ={
      APProducto: '',
      APCodigo: '',
      APUnidad: 0,
      APCategoria: 0,
      APObservaciones: '',
      APImagen: '',
      
      
    }
    this.removeImage();
  
  }
  eliminar(producto: string){
    const index = this.productos.indexOf(producto);
    this.productos.splice(index, 1);
  }

  selectProd(){
    this.router.navigate(['detalleProducto']);
  }
}
const ELEMENT_DATA: any[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K', categoria: 'categoria1', observaciones: 'observaciones1'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca', categoria: 'categoria1', observaciones: 'observaciones1'},
];

