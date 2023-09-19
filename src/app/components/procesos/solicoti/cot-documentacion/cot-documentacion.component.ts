import { Component,Input } from '@angular/core';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';

@Component({
  selector: 'app-cot-documentacion',
  templateUrl: './cot-documentacion.component.html',
  styleUrls: ['./cot-documentacion.component.css'],
})
export class CotDocumentacionComponent {
  //Variable de archivo
  // filesAll!:any;
  filesAll!: File;
  
  //variables compartidas
  @Input() tipoSol!: number;
  @Input() noSol!: number;
  
  prefijo!: string;
  constructor(private uploadfile: UploadFileService) {}
  imprimir(){
    this.prefijo='COT'+this.noSol+'-';
    console.log('Imprimir esto ', this.noSol, this.tipoSol,this.prefijo);
  }
  getFiles(event: any): void {
    // const [files]=$event.target.files;
    this.filesAll = event.target.files[0];
    console.log('Imprimir esto  Objetos de pdf ', this.filesAll);
  }

  sendfile(): void {
      const body = new FormData();
      this.prefijo='COT'+this.noSol+'-';
      body.append('archivos', this.filesAll);
      this.uploadfile.uploadFile(body,this.prefijo,this.tipoSol).subscribe({
        next: (data) => {
          console.log('este es mi data', data);
        },
        error: (error) => {
          console.error('este es mi error', error);
        },
        complete: () => {
          console.log('Proceso completado');
        },
      });
    
  }
}
