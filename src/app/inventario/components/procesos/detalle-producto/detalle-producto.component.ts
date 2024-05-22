import { Component, ElementRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AfterViewInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleComponent {
  @ViewChild('modalContainer') modalContainer!: ElementRef;
  @ViewChild('fileInput')
  fileInput: any;
  
  isimagen: boolean = false;
  tipoMovimiento: Number=0

  
  ngAfterViewInit() {
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

        this.fileInput.nativeElement.value = '';

        this.isimagen = true;
      };

      reader.readAsDataURL(selectedFile);
    }
    
  }
  

}
